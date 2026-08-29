package com.acgmall.controller;

import com.acgmall.common.Result;
import com.acgmall.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/list")
    public Result<?> list() {
        try {
            return categoryService.list();
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
