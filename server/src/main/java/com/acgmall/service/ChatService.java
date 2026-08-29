package com.acgmall.service;

import com.acgmall.common.Result;
import com.acgmall.entity.ChatMessage;
import com.acgmall.entity.ChatSession;
import com.acgmall.entity.User;
import com.acgmall.mapper.ChatMessageMapper;
import com.acgmall.mapper.ChatSessionMapper;
import com.acgmall.mapper.UserMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    private static final String SENDER_USER = "user";
    private static final String SENDER_ADMIN = "admin";

    @Autowired
    private ChatSessionMapper chatSessionMapper;

    @Autowired
    private ChatMessageMapper chatMessageMapper;

    @Autowired
    private UserMapper userMapper;

    public Result<?> getOrCreateSession(Integer userId, Integer productId, String productName) {
        LambdaQueryWrapper<ChatSession> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ChatSession::getUserId, userId);
        ChatSession session = chatSessionMapper.selectOne(wrapper);

        boolean isNew = false;
        if (session == null) {
            session = new ChatSession();
            session.setUserId(userId);
            session.setProductId(productId);
            session.setProductName(productName);
            session.setLastMessage("");
            session.setUnreadUser(0);
            session.setUnreadAdmin(0);
            session.setCreatedAt(LocalDateTime.now());
            session.setUpdatedAt(LocalDateTime.now());
            chatSessionMapper.insert(session);
            isNew = true;
            insertAdminMessage(session.getId(), 1, "您好，欢迎咨询 ACG 商城客服！请问有什么可以帮助您的？");
        } else if (productId != null) {
            session.setProductId(productId);
            session.setProductName(productName);
            session.setUpdatedAt(LocalDateTime.now());
            chatSessionMapper.updateById(session);
        }

        Map<String, Object> data = buildSessionMap(session);
        data.put("isNew", isNew);
        return Result.success(data);
    }

    public Result<?> userMessages(Integer userId, Integer sessionId) {
        ChatSession session = getUserSession(userId, sessionId);
        if (session == null) {
            return Result.error("会话不存在");
        }
        markReadForUser(session);
        return Result.success(listMessages(sessionId));
    }

    public Result<?> userSend(Integer userId, Integer sessionId, String content) {
        if (!StringUtils.hasText(content)) {
            return Result.error("消息不能为空");
        }
        content = content.trim();
        if (content.length() > 500) {
            return Result.error("消息过长");
        }

        ChatSession session = getUserSession(userId, sessionId);
        if (session == null) {
            return Result.error("会话不存在");
        }

        ChatMessage message = insertUserMessage(session, userId, content);
        return Result.success(toMessageMap(message));
    }

    public Result<?> adminSessions() {
        LambdaQueryWrapper<ChatSession> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByDesc(ChatSession::getUpdatedAt);
        List<ChatSession> sessions = chatSessionMapper.selectList(wrapper);

        List<Map<String, Object>> list = new ArrayList<>();
        for (ChatSession session : sessions) {
            Map<String, Object> item = buildSessionMap(session);
            User user = userMapper.selectById(session.getUserId());
            item.put("userNickname", user != null ? user.getNickname() : "用户");
            item.put("userAvatar", user != null ? user.getAvatar() : null);
            item.put("userPhone", user != null ? user.getPhone() : null);
            list.add(item);
        }
        return Result.success(list);
    }

    public Result<?> adminMessages(Integer sessionId) {
        ChatSession session = chatSessionMapper.selectById(sessionId);
        if (session == null) {
            return Result.error("会话不存在");
        }
        markReadForAdmin(session);
        Map<String, Object> data = new HashMap<>();
        data.put("session", buildSessionMap(session));
        User user = userMapper.selectById(session.getUserId());
        data.put("userNickname", user != null ? user.getNickname() : "用户");
        data.put("userAvatar", user != null ? user.getAvatar() : null);
        data.put("userPhone", user != null ? user.getPhone() : null);
        data.put("messages", listMessages(sessionId));
        return Result.success(data);
    }

    public Result<?> adminSend(Integer adminId, Integer sessionId, String content) {
        if (!StringUtils.hasText(content)) {
            return Result.error("消息不能为空");
        }
        content = content.trim();
        if (content.length() > 500) {
            return Result.error("消息过长");
        }

        ChatSession session = chatSessionMapper.selectById(sessionId);
        if (session == null) {
            return Result.error("会话不存在");
        }

        ChatMessage message = insertAdminMessage(sessionId, adminId, content);
        session.setLastMessage(content);
        session.setUpdatedAt(LocalDateTime.now());
        session.setUnreadUser((session.getUnreadUser() == null ? 0 : session.getUnreadUser()) + 1);
        chatSessionMapper.updateById(session);
        return Result.success(toMessageMap(message));
    }

    private ChatSession getUserSession(Integer userId, Integer sessionId) {
        ChatSession session = chatSessionMapper.selectById(sessionId);
        if (session == null || !session.getUserId().equals(userId)) {
            return null;
        }
        return session;
    }

    private ChatMessage insertUserMessage(ChatSession session, Integer userId, String content) {
        ChatMessage message = new ChatMessage();
        message.setSessionId(session.getId());
        message.setSenderType(SENDER_USER);
        message.setSenderId(userId);
        message.setContent(content);
        message.setCreatedAt(LocalDateTime.now());
        chatMessageMapper.insert(message);

        session.setLastMessage(content);
        session.setUpdatedAt(LocalDateTime.now());
        session.setUnreadAdmin((session.getUnreadAdmin() == null ? 0 : session.getUnreadAdmin()) + 1);
        chatSessionMapper.updateById(session);
        return message;
    }

    private ChatMessage insertAdminMessage(Integer sessionId, Integer adminId, String content) {
        ChatMessage message = new ChatMessage();
        message.setSessionId(sessionId);
        message.setSenderType(SENDER_ADMIN);
        message.setSenderId(adminId);
        message.setContent(content);
        message.setCreatedAt(LocalDateTime.now());
        chatMessageMapper.insert(message);

        ChatSession session = chatSessionMapper.selectById(sessionId);
        if (session != null) {
            session.setLastMessage(content);
            session.setUpdatedAt(LocalDateTime.now());
            session.setUnreadUser((session.getUnreadUser() == null ? 0 : session.getUnreadUser()) + 1);
            chatSessionMapper.updateById(session);
        }
        return message;
    }

    private void markReadForUser(ChatSession session) {
        if (session.getUnreadUser() != null && session.getUnreadUser() > 0) {
            session.setUnreadUser(0);
            chatSessionMapper.updateById(session);
        }
    }

    private void markReadForAdmin(ChatSession session) {
        if (session.getUnreadAdmin() != null && session.getUnreadAdmin() > 0) {
            session.setUnreadAdmin(0);
            chatSessionMapper.updateById(session);
        }
    }

    private List<Map<String, Object>> listMessages(Integer sessionId) {
        LambdaQueryWrapper<ChatMessage> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ChatMessage::getSessionId, sessionId)
                .orderByAsc(ChatMessage::getCreatedAt);
        List<ChatMessage> messages = chatMessageMapper.selectList(wrapper);

        List<Map<String, Object>> list = new ArrayList<>();
        for (ChatMessage message : messages) {
            list.add(toMessageMap(message));
        }
        return list;
    }

    private Map<String, Object> buildSessionMap(ChatSession session) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", session.getId());
        map.put("userId", session.getUserId());
        map.put("productId", session.getProductId());
        map.put("productName", session.getProductName());
        map.put("lastMessage", session.getLastMessage());
        map.put("unreadUser", session.getUnreadUser());
        map.put("unreadAdmin", session.getUnreadAdmin());
        map.put("updatedAt", session.getUpdatedAt());
        map.put("createdAt", session.getCreatedAt());
        return map;
    }

    private Map<String, Object> toMessageMap(ChatMessage message) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", message.getId());
        map.put("sessionId", message.getSessionId());
        map.put("senderType", message.getSenderType());
        map.put("senderId", message.getSenderId());
        map.put("content", message.getContent());
        map.put("createdAt", message.getCreatedAt());
        map.put("timeText", formatTime(message.getCreatedAt()));
        return map;
    }

    private String formatTime(LocalDateTime time) {
        if (time == null) {
            return "";
        }
        return time.format(DateTimeFormatter.ofPattern("MM-dd HH:mm"));
    }
}
