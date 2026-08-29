package com.acgmall.controller.admin;

import com.acgmall.common.Result;
import com.acgmall.service.ChatService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/chat")
public class AdminChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private HttpServletRequest request;

    private Integer getCurrentAdminId() {
        return (Integer) request.getAttribute("adminId");
    }

    @GetMapping("/sessions")
    public Result<?> sessions() {
        try {
            return chatService.adminSessions();
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/messages/{sessionId}")
    public Result<?> messages(@PathVariable Integer sessionId) {
        try {
            return chatService.adminMessages(sessionId);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/send")
    public Result<?> send(@RequestBody Map<String, Object> params) {
        try {
            Integer adminId = getCurrentAdminId();
            Integer sessionId = Integer.valueOf(params.get("sessionId").toString());
            String content = params.get("content") != null ? params.get("content").toString() : "";
            return chatService.adminSend(adminId, sessionId, content);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
