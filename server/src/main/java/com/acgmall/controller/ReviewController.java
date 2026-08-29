package com.acgmall.controller;

import com.acgmall.common.Result;
import com.acgmall.entity.Review;
import com.acgmall.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private HttpServletRequest request;

    private Integer getCurrentUserId() {
        return (Integer) request.getAttribute("userId");
    }

    @PostMapping("/add")
    public Result<?> add(@RequestBody Review review) {
        try {
            Integer userId = getCurrentUserId();
            review.setUserId(userId);
            return reviewService.add(userId, review);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/list")
    public Result<?> list(
            @RequestParam Integer productId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        try {
            return reviewService.list(productId, page, pageSize);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
