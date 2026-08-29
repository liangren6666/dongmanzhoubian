package com.acgmall.service;

import com.acgmall.common.JwtUtils;
import com.acgmall.common.Result;
import com.acgmall.entity.*;
import com.acgmall.mapper.*;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private AdminMapper adminMapper;

    @Autowired
    private OrdersMapper ordersMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private OrderItemMapper orderItemMapper;

    @Autowired
    private JwtUtils jwtUtils;

    public Result<?> login(String username, String password) {
        LambdaQueryWrapper<Admin> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Admin::getUsername, username);
        Admin admin = adminMapper.selectOne(wrapper);
        if (admin == null) {
            return Result.error("用户名不存在");
        }
        if (!admin.getPassword().equals(password)) {
            return Result.error("密码错误");
        }
        if (admin.getStatus() != 1) {
            return Result.error("账号已被禁用");
        }
        String token = jwtUtils.generateToken(admin.getId(), "admin");
        admin.setPassword(null);
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("adminInfo", admin);
        return Result.success(data);
    }

    public Result<?> dashboard(String trendStart, String trendEnd, String trendAll) {
        Map<String, Object> data = new HashMap<>();

        Long orderCount = ordersMapper.selectCount(null);
        data.put("orderCount", orderCount);

        LambdaQueryWrapper<Orders> revenueWrapper = new LambdaQueryWrapper<>();
        revenueWrapper.in(Orders::getStatus, 1, 2, 3);
        List<Orders> paidOrders = ordersMapper.selectList(revenueWrapper);
        BigDecimal revenue = paidOrders.stream()
                .map(Orders::getPayAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        data.put("totalRevenue", revenue);

        Long userCount = userMapper.selectCount(null);
        data.put("userCount", userCount);

        LambdaQueryWrapper<Product> productWrapper = new LambdaQueryWrapper<>();
        productWrapper.eq(Product::getStatus, 1);
        Long productCount = productMapper.selectCount(productWrapper);
        data.put("productCount", productCount);

        LambdaQueryWrapper<Orders> recentWrapper = new LambdaQueryWrapper<>();
        recentWrapper.orderByDesc(Orders::getCreatedAt).last("LIMIT 10");
        List<Orders> recentOrdersList = ordersMapper.selectList(recentWrapper);
        List<Map<String, Object>> recentOrders = new ArrayList<>();
        for (Orders order : recentOrdersList) {
            Map<String, Object> orderMap = new HashMap<>();
            orderMap.put("id", order.getId());
            orderMap.put("orderNo", order.getOrderNo());
            orderMap.put("payAmount", order.getTotalAmount());
            orderMap.put("status", order.getStatus());
            orderMap.put("createdAt", order.getCreatedAt());
            User user = userMapper.selectById(order.getUserId());
            orderMap.put("userName", user != null ? user.getNickname() : null);

            LambdaQueryWrapper<OrderItem> itemWrapper = new LambdaQueryWrapper<>();
            itemWrapper.eq(OrderItem::getOrderId, order.getId());
            List<OrderItem> items = orderItemMapper.selectList(itemWrapper);
            orderMap.put("items", items);
            recentOrders.add(orderMap);
        }
        data.put("recentOrders", recentOrders);

        LocalDate endDate;
        LocalDate startDate;
        if ("true".equalsIgnoreCase(trendAll)) {
            LocalDate[] range = resolveOrderDateRange();
            if (range != null) {
                startDate = range[0];
                endDate = range[1];
            } else {
                endDate = LocalDate.now();
                startDate = endDate.minusDays(6);
            }
        } else {
            endDate = parseDate(trendEnd, LocalDate.now());
            startDate = parseDate(trendStart, endDate.minusDays(6));
            if (startDate.isAfter(endDate)) {
                LocalDate temp = startDate;
                startDate = endDate;
                endDate = temp;
            }
        }

        List<Map<String, Object>> orderTrend = buildOrderTrend(startDate, endDate);
        if (!"true".equalsIgnoreCase(trendAll)
                && !StringUtils.hasText(trendStart) && !StringUtils.hasText(trendEnd)
                && orderTrend.stream().mapToLong(item -> ((Number) item.get("count")).longValue()).sum() == 0) {
            LocalDate[] range = resolveOrderDateRange();
            if (range != null) {
                startDate = range[0];
                endDate = range[1];
                orderTrend = buildOrderTrend(startDate, endDate);
            }
        }

        data.put("orderTrend", orderTrend);
        data.put("trendStart", startDate.toString());
        data.put("trendEnd", endDate.toString());

        List<Category> categories = categoryMapper.selectList(null);
        List<Map<String, Object>> categoryDistribution = new ArrayList<>();
        for (Category category : categories) {
            Map<String, Object> stat = new HashMap<>();
            stat.put("name", category.getName());
            LambdaQueryWrapper<Product> cpw = new LambdaQueryWrapper<>();
            cpw.eq(Product::getCategoryId, category.getId());
            Long count = productMapper.selectCount(cpw);
            stat.put("count", count);
            categoryDistribution.add(stat);
        }
        data.put("categoryDistribution", categoryDistribution);

        return Result.success(data);
    }

    private LocalDate parseDate(String value, LocalDate defaultValue) {
        if (!StringUtils.hasText(value)) {
            return defaultValue;
        }
        return LocalDate.parse(value);
    }

    private LocalDate[] resolveOrderDateRange() {
        LambdaQueryWrapper<Orders> ascWrapper = new LambdaQueryWrapper<>();
        ascWrapper.orderByAsc(Orders::getCreatedAt).last("LIMIT 1");
        Orders firstOrder = ordersMapper.selectOne(ascWrapper);
        if (firstOrder == null || firstOrder.getCreatedAt() == null) {
            return null;
        }

        LambdaQueryWrapper<Orders> descWrapper = new LambdaQueryWrapper<>();
        descWrapper.orderByDesc(Orders::getCreatedAt).last("LIMIT 1");
        Orders lastOrder = ordersMapper.selectOne(descWrapper);
        if (lastOrder == null || lastOrder.getCreatedAt() == null) {
            return null;
        }

        return new LocalDate[]{
                firstOrder.getCreatedAt().toLocalDate(),
                lastOrder.getCreatedAt().toLocalDate()
        };
    }

    private List<Map<String, Object>> buildOrderTrend(LocalDate startDate, LocalDate endDate) {
        long days = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        if (days > 366) {
            endDate = startDate.plusDays(365);
            days = 366;
        }

        LocalDateTime startTime = startDate.atStartOfDay();
        LocalDateTime endTime = endDate.atTime(23, 59, 59);

        LambdaQueryWrapper<Orders> wrapper = new LambdaQueryWrapper<>();
        wrapper.ge(Orders::getCreatedAt, startTime)
                .le(Orders::getCreatedAt, endTime);
        List<Orders> orders = ordersMapper.selectList(wrapper);

        if (days > 90) {
            DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("yyyy-MM");
            Map<String, Long> countMap = orders.stream()
                    .collect(Collectors.groupingBy(
                            o -> o.getCreatedAt().toLocalDate().format(monthFormatter),
                            Collectors.counting()));

            List<Map<String, Object>> trend = new ArrayList<>();
            LocalDate cursor = startDate.withDayOfMonth(1);
            LocalDate monthEnd = endDate.withDayOfMonth(1);
            while (!cursor.isAfter(monthEnd)) {
                String label = cursor.format(monthFormatter);
                Map<String, Object> item = new HashMap<>();
                item.put("date", label);
                item.put("count", countMap.getOrDefault(label, 0L));
                trend.add(item);
                cursor = cursor.plusMonths(1);
            }
            return trend;
        }

        DateTimeFormatter dayFormatter = DateTimeFormatter.ofPattern("MM-dd");
        Map<String, Long> countMap = orders.stream()
                .collect(Collectors.groupingBy(
                        o -> o.getCreatedAt().toLocalDate().format(dayFormatter),
                        Collectors.counting()));

        List<Map<String, Object>> trend = new ArrayList<>();
        for (long i = 0; i < days; i++) {
            LocalDate date = startDate.plusDays(i);
            String dateStr = date.format(dayFormatter);
            Map<String, Object> item = new HashMap<>();
            item.put("date", dateStr);
            item.put("count", countMap.getOrDefault(dateStr, 0L));
            trend.add(item);
        }
        return trend;
    }
}
