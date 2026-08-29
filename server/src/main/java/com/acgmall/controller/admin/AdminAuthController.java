package com.acgmall.controller.admin;

import com.acgmall.common.Result;
import com.acgmall.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminAuthController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public Result<?> login(@RequestBody Map<String, String> params) {
        try {
            String username = params.get("username");
            String password = params.get("password");
            if (username == null || password == null) {
                return Result.error("用户名和密码不能为空");
            }
            return adminService.login(username, password);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
