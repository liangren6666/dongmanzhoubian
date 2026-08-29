package com.acgmall.controller;

import com.acgmall.common.Result;
import com.acgmall.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private HttpServletRequest request;

    private Integer getCurrentUserId() {
        return (Integer) request.getAttribute("userId");
    }

    @PostMapping("/create")
    public Result<?> create(@RequestBody Map<String, Object> params) {
        try {
            Integer userId = getCurrentUserId();
            Integer addressId = (Integer) params.get("addressId");
            String remark = (String) params.get("remark");

            List<Integer> cartIds = new ArrayList<>();
            Object cartIdsObj = params.get("cartIds");
            if (cartIdsObj instanceof List<?> rawList) {
                for (Object item : rawList) {
                    if (item instanceof Integer intVal) {
                        cartIds.add(intVal);
                    } else if (item instanceof Number numVal) {
                        cartIds.add(numVal.intValue());
                    }
                }
            }

            return orderService.create(userId, addressId, cartIds, remark);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/list")
    public Result<?> list(
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        try {
            Integer userId = getCurrentUserId();
            return orderService.list(userId, status, page, pageSize);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/detail/{id}")
    public Result<?> detail(@PathVariable Integer id) {
        try {
            Integer userId = getCurrentUserId();
            return orderService.detail(userId, id);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/cancel/{id}")
    public Result<?> cancel(@PathVariable Integer id) {
        try {
            Integer userId = getCurrentUserId();
            return orderService.cancel(userId, id);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/pay/{id}")
    public Result<?> pay(@PathVariable Integer id) {
        try {
            Integer userId = getCurrentUserId();
            return orderService.pay(userId, id);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/confirm/{id}")
    public Result<?> confirmReceive(@PathVariable Integer id) {
        try {
            Integer userId = getCurrentUserId();
            return orderService.confirmReceive(userId, id);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
