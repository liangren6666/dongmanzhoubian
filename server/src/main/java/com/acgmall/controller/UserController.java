package com.acgmall.controller;

import com.acgmall.common.Result;
import com.acgmall.entity.User;
import com.acgmall.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private HttpServletRequest request;

    private Integer getCurrentUserId() {
        return (Integer) request.getAttribute("userId");
    }

    @PostMapping("/login")
    public Result<?> login(@RequestBody Map<String, String> params) {
        try {
            String phone = params.get("phone");
            String password = params.get("password");
            return userService.login(phone, password);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/register")
    public Result<?> register(@RequestBody Map<String, String> params) {
        try {
            String phone = params.get("phone");
            String password = params.get("password");
            String nickname = params.get("nickname");
            return userService.register(phone, password, nickname);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/profile")
    public Result<?> getProfile() {
        try {
            Integer userId = getCurrentUserId();
            return userService.getProfile(userId);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/profile")
    public Result<?> updateProfile(@RequestBody User user) {
        try {
            Integer userId = getCurrentUserId();
            return userService.updateProfile(userId, user);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
