package com.acgmall.controller.admin;

import com.acgmall.common.Result;
import com.acgmall.entity.Category;
import com.acgmall.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/category")
public class AdminCategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/list")
    public Result<?> list() {
        try {
            return categoryService.adminList();
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/add")
    public Result<?> add(@RequestBody Category category) {
        try {
            return categoryService.add(category);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/update")
    public Result<?> update(@RequestBody Category category) {
        try {
            return categoryService.update(category);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public Result<?> delete(@PathVariable Integer id) {
        try {
            return categoryService.delete(id);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
