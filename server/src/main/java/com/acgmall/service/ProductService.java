package com.acgmall.service;

import com.acgmall.common.Result;
import com.acgmall.entity.*;
import com.acgmall.mapper.*;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private ReviewMapper reviewMapper;

    @Autowired
    private OrderItemMapper orderItemMapper;

    @Autowired
    private OrdersMapper ordersMapper;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Result<?> list(Integer categoryId, String keyword, String sortField,
                          String sortOrder, Integer page, Integer pageSize) {
        if (page == null || page < 1) page = 1;
        if (pageSize == null || pageSize < 1) pageSize = 10;

        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Product::getStatus, 1);
        if (categoryId != null) {
            wrapper.eq(Product::getCategoryId, categoryId);
        }
        if (StringUtils.hasText(keyword)) {
            wrapper.like(Product::getName, keyword);
        }
        if ("price".equals(sortField)) {
            wrapper.orderBy(true, "asc".equalsIgnoreCase(sortOrder), Product::getPrice);
        } else if ("sales".equals(sortField)) {
            wrapper.orderBy(true, "asc".equalsIgnoreCase(sortOrder), Product::getSales);
        } else {
            wrapper.orderByDesc(Product::getId);
        }

        Page<Product> pageParam = new Page<>(page, pageSize);
        productMapper.selectPage(pageParam, wrapper);

        Map<String, Object> data = new HashMap<>();
        data.put("list", pageParam.getRecords());
        data.put("total", pageParam.getTotal());
        data.put("page", page);
        data.put("pageSize", pageSize);
        return Result.success(data);
    }

    public Result<?> detail(Integer id) {
        Product product = productMapper.selectById(id);
        if (product == null) {
            return Result.error("商品不存在");
        }

        Map<String, Object> data = new HashMap<>();
        data.put("id", product.getId());
        data.put("categoryId", product.getCategoryId());
        data.put("name", product.getName());
        data.put("description", product.getDescription());
        data.put("price", product.getPrice());
        data.put("originalPrice", product.getOriginalPrice());
        data.put("stock", product.getStock());
        data.put("sales", product.getSales());
        data.put("mainImage", product.getMainImage());
        data.put("status", product.getStatus());

        Category category = categoryMapper.selectById(product.getCategoryId());
        data.put("categoryName", category != null ? category.getName() : null);

        try {
            if (StringUtils.hasText(product.getImages())) {
                List<String> imageList = objectMapper.readValue(
                        product.getImages(), new TypeReference<List<String>>() {});
                data.put("images", imageList);
            } else {
                data.put("images", new ArrayList<>());
            }
        } catch (Exception e) {
            data.put("images", new ArrayList<>());
        }

        LambdaQueryWrapper<Review> reviewWrapper = new LambdaQueryWrapper<>();
        reviewWrapper.eq(Review::getProductId, id).eq(Review::getStatus, 1);
        Long reviewCount = reviewMapper.selectCount(reviewWrapper);
        data.put("reviewCount", reviewCount);

        return Result.success(data);
    }

    public Result<?> recommend(Integer userId, Integer limit) {
        if (limit == null || limit < 1) limit = 10;

        // 已登录用户：协同过滤
        if (userId != null) {
            List<Product> cfResult = collaborativeFilter(userId, limit);
            if (cfResult.size() >= limit) {
                return Result.success(cfResult.subList(0, limit));
            }
            // 协同过滤数量不足，用分类偏好补全
            if (!cfResult.isEmpty()) {
                Set<Integer> excludeIds = cfResult.stream()
                        .map(Product::getId).collect(Collectors.toSet());
                List<Product> fill = categoryPreferenceFill(userId, excludeIds, limit - cfResult.size());
                cfResult.addAll(fill);
                if (cfResult.size() >= limit) {
                    return Result.success(cfResult.subList(0, limit));
                }
                // 仍不足，最终兜底
                excludeIds.addAll(fill.stream().map(Product::getId).collect(Collectors.toSet()));
                cfResult.addAll(popularFill(excludeIds, limit - cfResult.size()));
                return Result.success(cfResult);
            }
        }

        // 未登录或无购买记录：按销量×评分综合热度排序
        return Result.success(popularFill(Collections.emptySet(), limit));
    }

    public Result<?> latest(Integer limit) {
        if (limit == null || limit < 1) limit = 6;
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Product::getStatus, 1)
                .orderByDesc(Product::getCreatedAt)
                .last("LIMIT " + limit);
        List<Product> products = productMapper.selectList(wrapper);
        return Result.success(products);
    }

    /**
     * 加权协同过滤：
     * 1. 找出与当前用户购买过相同商品的协同用户
     * 2. 对协同用户购买的商品按频次（购买权重3）+ 评价权重（好评乘1.5）打分
     * 3. 过滤掉当前用户已购商品，返回得分最高的商品列表
     */
    private List<Product> collaborativeFilter(Integer userId, int limit) {
        // 当前用户购买过的商品
        LambdaQueryWrapper<Orders> ow = new LambdaQueryWrapper<>();
        ow.eq(Orders::getUserId, userId).in(Orders::getStatus, 1, 2, 3);
        List<Orders> userOrders = ordersMapper.selectList(ow);
        if (userOrders.isEmpty()) return Collections.emptyList();

        List<Integer> userOrderIds = userOrders.stream().map(Orders::getId).toList();
        LambdaQueryWrapper<OrderItem> iw = new LambdaQueryWrapper<>();
        iw.in(OrderItem::getOrderId, userOrderIds);
        List<OrderItem> userItems = orderItemMapper.selectList(iw);
        Set<Integer> userProductIds = userItems.stream()
                .map(OrderItem::getProductId).collect(Collectors.toSet());
        if (userProductIds.isEmpty()) return Collections.emptyList();

        // 找到与目标用户购买过相同商品的其他用户
        LambdaQueryWrapper<OrderItem> spw = new LambdaQueryWrapper<>();
        spw.in(OrderItem::getProductId, userProductIds);
        List<OrderItem> sameProductItems = orderItemMapper.selectList(spw);
        Set<Integer> relatedOrderIds = sameProductItems.stream()
                .map(OrderItem::getOrderId).collect(Collectors.toSet());

        LambdaQueryWrapper<Orders> oow = new LambdaQueryWrapper<>();
        oow.in(Orders::getId, relatedOrderIds).ne(Orders::getUserId, userId);
        List<Orders> otherOrders = ordersMapper.selectList(oow);
        if (otherOrders.isEmpty()) return Collections.emptyList();

        Set<Integer> otherUserIds = otherOrders.stream()
                .map(Orders::getUserId).collect(Collectors.toSet());

        // 取协同用户的所有购买记录
        LambdaQueryWrapper<Orders> tow = new LambdaQueryWrapper<>();
        tow.in(Orders::getUserId, otherUserIds);
        List<Orders> theirOrders = ordersMapper.selectList(tow);
        if (theirOrders.isEmpty()) return Collections.emptyList();

        List<Integer> theirOrderIds = theirOrders.stream().map(Orders::getId).toList();
        LambdaQueryWrapper<OrderItem> tiw = new LambdaQueryWrapper<>();
        tiw.in(OrderItem::getOrderId, theirOrderIds);
        List<OrderItem> theirItems = orderItemMapper.selectList(tiw);

        // 计算商品被购买的加权分数（基础分：购买次数 * 3）
        Map<Integer, Double> scoreMap = new HashMap<>();
        for (OrderItem item : theirItems) {
            Integer pid = item.getProductId();
            if (!userProductIds.contains(pid)) {
                scoreMap.merge(pid, 3.0, Double::sum);
            }
        }
        if (scoreMap.isEmpty()) return Collections.emptyList();

        // 评价权重：好评（4-5星）额外 ×1.5，差评（1-2星）× 0.5
        LambdaQueryWrapper<Review> rw = new LambdaQueryWrapper<>();
        rw.in(Review::getProductId, scoreMap.keySet()).eq(Review::getStatus, 1);
        List<Review> reviews = reviewMapper.selectList(rw);
        for (Review r : reviews) {
            if (r.getRating() != null && scoreMap.containsKey(r.getProductId())) {
                double multiplier = r.getRating() >= 4 ? 1.5 : (r.getRating() <= 2 ? 0.5 : 1.0);
                scoreMap.put(r.getProductId(), scoreMap.get(r.getProductId()) * multiplier);
            }
        }

        // 按分数排序，取 top limit 个商品 ID
        List<Integer> recommendedIds = scoreMap.entrySet().stream()
                .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
                .limit(limit)
                .map(Map.Entry::getKey)
                .toList();

        LambdaQueryWrapper<Product> pw = new LambdaQueryWrapper<>();
        pw.in(Product::getId, recommendedIds).eq(Product::getStatus, 1);
        List<Product> products = productMapper.selectList(pw);

        // 按分数顺序排列返回结果
        Map<Integer, Double> finalScore = scoreMap;
        products.sort((a, b) -> Double.compare(
                finalScore.getOrDefault(b.getId(), 0.0),
                finalScore.getOrDefault(a.getId(), 0.0)));
        return products;
    }

    /**
     * 分类偏好补全：根据用户历史购买最多的分类，从该分类中补充商品
     */
    private List<Product> categoryPreferenceFill(Integer userId, Set<Integer> excludeIds, int need) {
        if (need <= 0) return Collections.emptyList();

        // 统计用户各分类购买次数
        LambdaQueryWrapper<Orders> ow = new LambdaQueryWrapper<>();
        ow.eq(Orders::getUserId, userId).in(Orders::getStatus, 1, 2, 3);
        List<Orders> userOrders = ordersMapper.selectList(ow);
        if (userOrders.isEmpty()) return popularFill(excludeIds, need);

        List<Integer> orderIds = userOrders.stream().map(Orders::getId).toList();
        LambdaQueryWrapper<OrderItem> iw = new LambdaQueryWrapper<>();
        iw.in(OrderItem::getOrderId, orderIds);
        List<OrderItem> items = orderItemMapper.selectList(iw);

        Set<Integer> productIds = items.stream().map(OrderItem::getProductId).collect(Collectors.toSet());
        LambdaQueryWrapper<Product> pp = new LambdaQueryWrapper<>();
        pp.in(Product::getId, productIds);
        List<Product> boughtProducts = productMapper.selectList(pp);

        Map<Integer, Long> categoryCount = boughtProducts.stream()
                .collect(Collectors.groupingBy(Product::getCategoryId, Collectors.counting()));

        // 按分类偏好降序，从各分类补充商品
        List<Map.Entry<Integer, Long>> sortedCategories = categoryCount.entrySet().stream()
                .sorted(Map.Entry.<Integer, Long>comparingByValue().reversed())
                .toList();

        List<Product> result = new ArrayList<>();
        Set<Integer> allExclude = new HashSet<>(excludeIds);

        for (Map.Entry<Integer, Long> entry : sortedCategories) {
            if (result.size() >= need) break;
            int remaining = need - result.size();
            LambdaQueryWrapper<Product> fw = new LambdaQueryWrapper<>();
            fw.eq(Product::getCategoryId, entry.getKey())
                    .eq(Product::getStatus, 1);
            if (!allExclude.isEmpty()) fw.notIn(Product::getId, allExclude);
            fw.orderByDesc(Product::getSales).last("LIMIT " + remaining);
            List<Product> batch = productMapper.selectList(fw);
            result.addAll(batch);
            batch.forEach(p -> allExclude.add(p.getId()));
        }
        return result;
    }

    /**
     * 热度兜底：按 销量*0.7 + 平均评分*0.3 综合热度排序
     */
    private List<Product> popularFill(Set<Integer> excludeIds, int need) {
        if (need <= 0) return Collections.emptyList();
        LambdaQueryWrapper<Product> pw = new LambdaQueryWrapper<>();
        pw.eq(Product::getStatus, 1);
        if (!excludeIds.isEmpty()) pw.notIn(Product::getId, excludeIds);
        pw.orderByDesc(Product::getSales).last("LIMIT " + (need * 3));
        List<Product> candidates = productMapper.selectList(pw);

        // 查询候选商品的平均评分
        if (candidates.isEmpty()) return Collections.emptyList();
        Set<Integer> cids = candidates.stream().map(Product::getId).collect(Collectors.toSet());
        LambdaQueryWrapper<Review> rw = new LambdaQueryWrapper<>();
        rw.in(Review::getProductId, cids).eq(Review::getStatus, 1);
        List<Review> reviews = reviewMapper.selectList(rw);

        Map<Integer, Double> avgRating = reviews.stream()
                .filter(r -> r.getRating() != null)
                .collect(Collectors.groupingBy(Review::getProductId,
                        Collectors.averagingDouble(Review::getRating)));

        long maxSales = candidates.stream().mapToLong(p -> p.getSales() == null ? 0 : p.getSales()).max().orElse(1);

        candidates.sort((a, b) -> {
            double salesA = (a.getSales() == null ? 0 : a.getSales()) * 1.0 / maxSales;
            double salesB = (b.getSales() == null ? 0 : b.getSales()) * 1.0 / maxSales;
            double ratingA = avgRating.getOrDefault(a.getId(), 3.0) / 5.0;
            double ratingB = avgRating.getOrDefault(b.getId(), 3.0) / 5.0;
            double scoreA = salesA * 0.7 + ratingA * 0.3;
            double scoreB = salesB * 0.7 + ratingB * 0.3;
            return Double.compare(scoreB, scoreA);
        });

        return candidates.subList(0, Math.min(need, candidates.size()));
    }

    public Result<?> adminList(Integer categoryId, String keyword, Integer status,
                               Integer page, Integer pageSize) {
        if (page == null || page < 1) page = 1;
        if (pageSize == null || pageSize < 1) pageSize = 10;

        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        if (categoryId != null) {
            wrapper.eq(Product::getCategoryId, categoryId);
        }
        if (StringUtils.hasText(keyword)) {
            wrapper.like(Product::getName, keyword);
        }
        if (status != null) {
            wrapper.eq(Product::getStatus, status);
        }
        wrapper.orderByDesc(Product::getId);

        Page<Product> pageParam = new Page<>(page, pageSize);
        productMapper.selectPage(pageParam, wrapper);

        List<Map<String, Object>> records = new ArrayList<>();
        for (Product product : pageParam.getRecords()) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", product.getId());
            map.put("categoryId", product.getCategoryId());
            map.put("name", product.getName());
            map.put("description", product.getDescription());
            map.put("price", product.getPrice());
            map.put("originalPrice", product.getOriginalPrice());
            map.put("stock", product.getStock());
            map.put("sales", product.getSales());
            map.put("mainImage", product.getMainImage());
            map.put("images", product.getImages());
            map.put("status", product.getStatus());
            Category category = categoryMapper.selectById(product.getCategoryId());
            map.put("categoryName", category != null ? category.getName() : null);
            records.add(map);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("list", records);
        data.put("total", pageParam.getTotal());
        data.put("page", page);
        data.put("pageSize", pageSize);
        return Result.success(data);
    }

    public Result<?> add(Product product) {
        productMapper.insert(product);
        return Result.success("添加成功", null);
    }

    public Result<?> update(Product product) {
        productMapper.updateById(product);
        return Result.success("更新成功", null);
    }

    public Result<?> delete(Integer id) {
        productMapper.deleteById(id);
        return Result.success("删除成功", null);
    }
}
