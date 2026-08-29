package com.acgmall.controller.admin;

import com.acgmall.common.Result;
import com.acgmall.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/order")
public class AdminOrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/list")
    public Result<?> list(
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        try {
            return orderService.adminList(status, keyword, page, pageSize);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/detail/{id}")
    public Result<?> detail(@PathVariable Integer id) {
        try {
            return orderService.adminDetail(id);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/ship/{id}")
    public Result<?> ship(@PathVariable Integer id) {
        try {
            return orderService.ship(id);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
