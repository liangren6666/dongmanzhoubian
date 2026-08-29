package com.acgmall.controller;

import com.acgmall.common.JwtUtils;
import com.acgmall.common.Result;
import com.acgmall.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private HttpServletRequest request;

    @GetMapping("/list")
    public Result<?> list(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sortField,
            @RequestParam(required = false) String sortOrder,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        try {
            return productService.list(categoryId, keyword, sortField, sortOrder, page, pageSize);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/detail/{id}")
    public Result<?> detail(@PathVariable Integer id) {
        try {
            return productService.detail(id);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/recommend")
    public Result<?> recommend(@RequestParam(required = false, defaultValue = "10") Integer limit) {
        try {
            Integer userId = null;
            String token = request.getHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                try {
                    userId = jwtUtils.getIdFromToken(token.substring(7));
                } catch (Exception ignored) {
                }
            }
            return productService.recommend(userId, limit);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/latest")
    public Result<?> latest(@RequestParam(required = false, defaultValue = "6") Integer limit) {
        try {
            return productService.latest(limit);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
