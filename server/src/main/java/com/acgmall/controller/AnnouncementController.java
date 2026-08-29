package com.acgmall.controller;

import com.acgmall.common.Result;
import com.acgmall.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/announcement")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    @GetMapping("/list")
    public Result<?> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        try {
            return announcementService.list(page, pageSize);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/detail/{id}")
    public Result<?> detail(@PathVariable Integer id) {
        try {
            return announcementService.detail(id);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
