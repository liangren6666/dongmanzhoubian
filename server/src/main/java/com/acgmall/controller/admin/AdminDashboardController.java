package com.acgmall.controller.admin;

import com.acgmall.common.Result;
import com.acgmall.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminDashboardController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard")
    public Result<?> dashboard(
            @RequestParam(required = false) String trendStart,
            @RequestParam(required = false) String trendEnd,
            @RequestParam(required = false) String trendAll) {
        try {
            return adminService.dashboard(trendStart, trendEnd, trendAll);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
