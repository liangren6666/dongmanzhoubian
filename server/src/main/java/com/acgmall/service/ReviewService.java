package com.acgmall.service;

import com.acgmall.common.Result;
import com.acgmall.entity.Orders;
import com.acgmall.entity.Product;
import com.acgmall.entity.Review;
import com.acgmall.entity.User;
import com.acgmall.mapper.OrdersMapper;
import com.acgmall.mapper.ProductMapper;
import com.acgmall.mapper.ReviewMapper;
import com.acgmall.mapper.UserMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReviewService {

    @Autowired
    private ReviewMapper reviewMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private OrdersMapper ordersMapper;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Result<?> add(Integer userId, Review review) {
        Orders order = ordersMapper.selectById(review.getOrderId());
        if (order == null || !order.getUserId().equals(userId)) {
            return Result.error("订单不存在");
        }
        if (order.getStatus() != 3) {
            return Result.error("只能评价已完成的订单");
        }

        LambdaQueryWrapper<Review> existWrapper = new LambdaQueryWrapper<>();
        existWrapper.eq(Review::getUserId, userId)
                .eq(Review::getProductId, review.getProductId())
                .eq(Review::getOrderId, review.getOrderId());
        Long count = reviewMapper.selectCount(existWrapper);
        if (count > 0) {
            return Result.error("该商品已评价");
        }

        review.setUserId(userId);
        review.setStatus(1);
        review.setCreatedAt(LocalDateTime.now());
        reviewMapper.insert(review);
        return Result.success("评价成功", null);
    }

    public Result<?> list(Integer productId, Integer page, Integer pageSize) {
        if (page == null || page < 1) page = 1;
        if (pageSize == null || pageSize < 1) pageSize = 10;

        LambdaQueryWrapper<Review> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Review::getProductId, productId)
               .eq(Review::getStatus, 1)
               .orderByDesc(Review::getCreatedAt);

        Page<Review> pageParam = new Page<>(page, pageSize);
        reviewMapper.selectPage(pageParam, wrapper);

        List<Map<String, Object>> records = new ArrayList<>();
        for (Review review : pageParam.getRecords()) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", review.getId());
            map.put("userId", review.getUserId());
            map.put("productId", review.getProductId());
            map.put("orderId", review.getOrderId());
            map.put("rating", review.getRating());
            map.put("content", review.getContent());
            map.put("createdAt", review.getCreatedAt());

            try {
                if (StringUtils.hasText(review.getImages())) {
                    List<String> imageList = objectMapper.readValue(
                            review.getImages(), new TypeReference<List<String>>() {});
                    map.put("images", imageList);
                } else {
                    map.put("images", new ArrayList<>());
                }
            } catch (Exception e) {
                map.put("images", new ArrayList<>());
            }

            User user = userMapper.selectById(review.getUserId());
            if (user != null) {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("nickname", user.getNickname());
                userMap.put("avatar", user.getAvatar());
                map.put("user", userMap);
                map.put("nickname", user.getNickname());
                map.put("avatar", user.getAvatar());
            }
            records.add(map);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("list", records);
        data.put("total", pageParam.getTotal());
        data.put("page", page);
        data.put("pageSize", pageSize);
        return Result.success(data);
    }

    public Result<?> adminList(String keyword, Integer page, Integer pageSize) {
        if (page == null || page < 1) page = 1;
        if (pageSize == null || pageSize < 1) pageSize = 10;

        LambdaQueryWrapper<Review> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            wrapper.like(Review::getContent, keyword);
        }
        wrapper.orderByDesc(Review::getCreatedAt);

        Page<Review> pageParam = new Page<>(page, pageSize);
        reviewMapper.selectPage(pageParam, wrapper);

        List<Map<String, Object>> records = new ArrayList<>();
        for (Review review : pageParam.getRecords()) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", review.getId());
            map.put("userId", review.getUserId());
            map.put("productId", review.getProductId());
            map.put("orderId", review.getOrderId());
            map.put("rating", review.getRating());
            map.put("content", review.getContent());
            map.put("status", review.getStatus());
            map.put("createdAt", review.getCreatedAt());

            try {
                if (StringUtils.hasText(review.getImages())) {
                    List<String> imageList = objectMapper.readValue(
                            review.getImages(), new TypeReference<List<String>>() {});
                    map.put("images", imageList);
                } else {
                    map.put("images", new ArrayList<>());
                }
            } catch (Exception e) {
                map.put("images", new ArrayList<>());
            }

            User user = userMapper.selectById(review.getUserId());
            if (user != null) {
                map.put("userName", user.getNickname());
                map.put("userAvatar", user.getAvatar());
            } else {
                map.put("userName", null);
                map.put("userAvatar", null);
            }

            Product product = productMapper.selectById(review.getProductId());
            map.put("productName", product != null ? product.getName() : null);

            records.add(map);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("list", records);
        data.put("total", pageParam.getTotal());
        data.put("page", page);
        data.put("pageSize", pageSize);
        return Result.success(data);
    }

    public Result<?> updateStatus(Integer id, Integer status) {
        Review review = reviewMapper.selectById(id);
        if (review == null) {
            return Result.error("评价不存在");
        }
        review.setStatus(status);
        reviewMapper.updateById(review);
        return Result.success("操作成功", null);
    }
}
