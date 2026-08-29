package com.acgmall.controller;

import com.acgmall.common.Result;
import com.acgmall.service.ChatService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private HttpServletRequest request;

    private Integer getCurrentUserId() {
        return (Integer) request.getAttribute("userId");
    }

    @PostMapping("/session")
    public Result<?> session(@RequestBody(required = false) Map<String, Object> params) {
        try {
            Integer userId = getCurrentUserId();
            Integer productId = params != null && params.get("productId") != null
                    ? Integer.valueOf(params.get("productId").toString()) : null;
            String productName = params != null && params.get("productName") != null
                    ? params.get("productName").toString() : null;
            return chatService.getOrCreateSession(userId, productId, productName);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/messages")
    public Result<?> messages(@RequestParam Integer sessionId) {
        try {
            Integer userId = getCurrentUserId();
            return chatService.userMessages(userId, sessionId);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/send")
    public Result<?> send(@RequestBody Map<String, Object> params) {
        try {
            Integer userId = getCurrentUserId();
            Integer sessionId = Integer.valueOf(params.get("sessionId").toString());
            String content = params.get("content") != null ? params.get("content").toString() : "";
            return chatService.userSend(userId, sessionId, content);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
