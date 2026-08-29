package com.acgmall.controller.admin;

import com.acgmall.common.Result;
import com.acgmall.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/review")
public class AdminReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/list")
    public Result<?> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        try {
            return reviewService.adminList(keyword, page, pageSize);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/update")
    public Result<?> update(@RequestBody Map<String, Object> params) {
        try {
            Integer id = (Integer) params.get("id");
            Boolean visible = (Boolean) params.get("visible");
            if (id == null || visible == null) {
                return Result.error("参数不完整");
            }
            Integer status = visible ? 1 : 0;
            return reviewService.updateStatus(id, status);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
