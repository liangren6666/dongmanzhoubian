package com.acgmall.service;

import com.acgmall.common.Result;
import com.acgmall.entity.Category;
import com.acgmall.entity.Product;
import com.acgmall.mapper.CategoryMapper;
import com.acgmall.mapper.ProductMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CategoryService {

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private ProductMapper productMapper;

    public Result<?> list() {
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Category::getStatus, 1)
               .orderByAsc(Category::getSortOrder);
        List<Category> categories = categoryMapper.selectList(wrapper);
        return Result.success(categories);
    }

    public Result<?> adminList() {
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(Category::getSortOrder).orderByAsc(Category::getId);
        List<Category> categories = categoryMapper.selectList(wrapper);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Category category : categories) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", category.getId());
            map.put("name", category.getName());
            map.put("icon", category.getIcon());
            map.put("sortOrder", category.getSortOrder());
            map.put("status", category.getStatus());
            map.put("createdAt", category.getCreatedAt());
            LambdaQueryWrapper<Product> pw = new LambdaQueryWrapper<>();
            pw.eq(Product::getCategoryId, category.getId());
            Long productCount = productMapper.selectCount(pw);
            map.put("productCount", productCount);
            result.add(map);
        }
        return Result.success(result);
    }

    public Result<?> add(Category category) {
        categoryMapper.insert(category);
        return Result.success("添加成功", null);
    }

    public Result<?> update(Category category) {
        categoryMapper.updateById(category);
        return Result.success("更新成功", null);
    }

    public Result<?> delete(Integer id) {
        categoryMapper.deleteById(id);
        return Result.success("删除成功", null);
    }
}
