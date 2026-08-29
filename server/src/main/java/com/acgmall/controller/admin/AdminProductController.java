package com.acgmall.controller.admin;

import com.acgmall.common.Result;
import com.acgmall.entity.Product;
import com.acgmall.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/product")
public class AdminProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/list")
    public Result<?> list(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        try {
            return productService.adminList(categoryId, keyword, status, page, pageSize);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/add")
    public Result<?> add(@RequestBody Product product) {
        try {
            return productService.add(product);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/update")
    public Result<?> update(@RequestBody Product product) {
        try {
            return productService.update(product);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public Result<?> delete(@PathVariable Integer id) {
        try {
            return productService.delete(id);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
