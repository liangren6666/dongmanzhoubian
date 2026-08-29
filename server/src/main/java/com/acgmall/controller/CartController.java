package com.acgmall.controller;

import com.acgmall.common.Result;
import com.acgmall.service.CartService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private HttpServletRequest request;

    private Integer getCurrentUserId() {
        return (Integer) request.getAttribute("userId");
    }

    @GetMapping("/list")
    public Result<?> list() {
        try {
            Integer userId = getCurrentUserId();
            return cartService.list(userId);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/add")
    public Result<?> add(@RequestBody Map<String, Object> params) {
        try {
            Integer userId = getCurrentUserId();
            Integer productId = (Integer) params.get("productId");
            Integer quantity = (Integer) params.get("quantity");
            return cartService.add(userId, productId, quantity);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/update")
    public Result<?> update(@RequestBody Map<String, Object> params) {
        try {
            Integer userId = getCurrentUserId();
            Integer id = (Integer) params.get("id");
            Integer quantity = (Integer) params.get("quantity");
            Boolean selectedBool = (Boolean) params.get("selected");
            Integer selected = selectedBool != null ? (selectedBool ? 1 : 0) : null;
            return cartService.update(id, userId, quantity, selected);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public Result<?> delete(@PathVariable Integer id) {
        try {
            Integer userId = getCurrentUserId();
            return cartService.delete(id, userId);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/select-all")
    public Result<?> selectAll(@RequestBody Map<String, Object> params) {
        try {
            Integer userId = getCurrentUserId();
            Boolean selected = (Boolean) params.get("selected");
            return cartService.selectAll(userId, selected);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
