package com.acgmall.controller;

import com.acgmall.common.Result;
import com.acgmall.service.AnnouncementService;
import com.acgmall.service.CategoryService;
import com.acgmall.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/home")
public class HomeController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ProductService productService;

    @Autowired
    private AnnouncementService announcementService;

    @GetMapping("/data")
    public Result<?> data() {
        try {
            List<Map<String, Object>> banners = List.of(
                    Map.of("id", 1, "image", "/api/uploads/product-01-pirate-figure.png", "url", "/pages/product/detail?id=1"),
                    Map.of("id", 2, "image", "/api/uploads/product-13-metal-pin-set.png", "url", "/pages/product/detail?id=2"),
                    Map.of("id", 3, "image", "/api/uploads/product-15-acrylic-keychains.png", "url", "/pages/product/detail?id=6"),
                    Map.of("id", 4, "image", "/api/uploads/product-07-notebook-set.png", "url", "/pages/product/detail?id=7"),
                    Map.of("id", 5, "image", "/api/uploads/product-11-twilight-art-poster.png", "url", "/pages/product/detail?id=11")
            );

            Result<?> announcementsResult = announcementService.list(1, 3);
            Result<?> categoriesResult = categoryService.list();
            Result<?> recommendResult = productService.recommend(null, 4);
            Result<?> latestResult = productService.latest(6);

            Map<String, Object> data = new HashMap<>();
            data.put("banners", banners);
            data.put("announcements", announcementsResult.getData());
            data.put("categories", categoriesResult.getData());
            data.put("latestProducts", latestResult.getData());
            data.put("recommendProducts", recommendResult.getData());

            return Result.success(data);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
