package com.acgmall.service;

import com.acgmall.common.Result;
import com.acgmall.entity.*;
import com.acgmall.mapper.*;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class OrderService {

    @Autowired
    private OrdersMapper ordersMapper;

    @Autowired
    private OrderItemMapper orderItemMapper;

    @Autowired
    private CartMapper cartMapper;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private AddressMapper addressMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private ReviewMapper reviewMapper;

    @Transactional(rollbackFor = Exception.class)
    public Result<?> create(Integer userId, Integer addressId, List<Integer> cartIds, String remark) {
        Address address = addressMapper.selectById(addressId);
        if (address == null || !address.getUserId().equals(userId)) {
            return Result.error("收货地址不存在");
        }

        LambdaQueryWrapper<Cart> cartWrapper = new LambdaQueryWrapper<>();
        cartWrapper.in(Cart::getId, cartIds).eq(Cart::getUserId, userId);
        List<Cart> cartList = cartMapper.selectList(cartWrapper);
        if (cartList.isEmpty()) {
            return Result.error("购物车中没有选中的商品");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<Map<String, Object>> itemSnapshots = new ArrayList<>();

        for (Cart cart : cartList) {
            Product product = productMapper.selectById(cart.getProductId());
            if (product == null || product.getStatus() != 1) {
                return Result.error("商品「" + (product != null ? product.getName() : cart.getProductId()) + "」已下架");
            }
            if (product.getStock() < cart.getQuantity()) {
                return Result.error("商品「" + product.getName() + "」库存不足");
            }
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(cart.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            Map<String, Object> snapshot = new HashMap<>();
            snapshot.put("product", product);
            snapshot.put("quantity", cart.getQuantity());
            itemSnapshots.add(snapshot);
        }

        String orderNo = generateOrderNo();

        Orders order = new Orders();
        order.setOrderNo(orderNo);
        order.setUserId(userId);
        order.setReceiverName(address.getReceiverName());
        order.setReceiverPhone(address.getReceiverPhone());
        String fullAddress = (address.getProvince() != null ? address.getProvince() : "")
                + (address.getCity() != null ? address.getCity() : "")
                + (address.getDistrict() != null ? address.getDistrict() : "")
                + (address.getDetail() != null ? address.getDetail() : "");
        order.setReceiverAddress(fullAddress);
        order.setTotalAmount(totalAmount);
        order.setPayAmount(totalAmount);
        order.setStatus(0);
        order.setRemark(remark);
        order.setCreatedAt(LocalDateTime.now());
        ordersMapper.insert(order);

        for (Map<String, Object> snapshot : itemSnapshots) {
            Product product = (Product) snapshot.get("product");
            Integer quantity = (Integer) snapshot.get("quantity");

            OrderItem item = new OrderItem();
            item.setOrderId(order.getId());
            item.setProductId(product.getId());
            item.setProductName(product.getName());
            item.setProductImage(product.getMainImage());
            item.setPrice(product.getPrice());
            item.setQuantity(quantity);
            orderItemMapper.insert(item);

            product.setStock(product.getStock() - quantity);
            product.setSales(product.getSales() + quantity);
            productMapper.updateById(product);
        }

        LambdaQueryWrapper<Cart> deleteWrapper = new LambdaQueryWrapper<>();
        deleteWrapper.in(Cart::getId, cartIds).eq(Cart::getUserId, userId);
        cartMapper.delete(deleteWrapper);

        Map<String, Object> data = new HashMap<>();
        data.put("orderId", order.getId());
        data.put("orderNo", order.getOrderNo());
        data.put("totalAmount", order.getTotalAmount());
        return Result.success("下单成功", data);
    }

    public Result<?> list(Integer userId, Integer status, Integer page, Integer pageSize) {
        if (page == null || page < 1) page = 1;
        if (pageSize == null || pageSize < 1) pageSize = 10;

        LambdaQueryWrapper<Orders> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Orders::getUserId, userId);
        if (status != null && status >= 0) {
            wrapper.eq(Orders::getStatus, status);
        }
        wrapper.orderByDesc(Orders::getCreatedAt);

        Page<Orders> pageParam = new Page<>(page, pageSize);
        ordersMapper.selectPage(pageParam, wrapper);

        List<Map<String, Object>> records = new ArrayList<>();
        for (Orders order : pageParam.getRecords()) {
            records.add(buildOrderDetail(order));
        }

        Map<String, Object> data = new HashMap<>();
        data.put("list", records);
        data.put("total", pageParam.getTotal());
        data.put("page", page);
        data.put("pageSize", pageSize);
        return Result.success(data);
    }

    public Result<?> detail(Integer userId, Integer orderId) {
        Orders order = ordersMapper.selectById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            return Result.error("订单不存在");
        }
        return Result.success(buildOrderDetail(order));
    }

    public Result<?> cancel(Integer userId, Integer orderId) {
        Orders order = ordersMapper.selectById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            return Result.error("订单不存在");
        }
        if (order.getStatus() != 0) {
            return Result.error("只能取消待付款的订单");
        }
        order.setStatus(4);
        ordersMapper.updateById(order);
        restoreStock(orderId);
        return Result.success("取消成功", null);
    }

    public Result<?> pay(Integer userId, Integer orderId) {
        Orders order = ordersMapper.selectById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            return Result.error("订单不存在");
        }
        if (order.getStatus() != 0) {
            return Result.error("订单状态异常，无法支付");
        }
        order.setStatus(1);
        order.setPayTime(LocalDateTime.now());
        ordersMapper.updateById(order);
        return Result.success("支付成功", null);
    }

    public Result<?> confirmReceive(Integer userId, Integer orderId) {
        Orders order = ordersMapper.selectById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            return Result.error("订单不存在");
        }
        if (order.getStatus() != 2) {
            return Result.error("订单状态异常，无法确认收货");
        }
        order.setStatus(3);
        order.setReceiveTime(LocalDateTime.now());
        ordersMapper.updateById(order);
        return Result.success("确认收货成功", null);
    }

    public Result<?> adminList(Integer status, String keyword, Integer page, Integer pageSize) {
        if (page == null || page < 1) page = 1;
        if (pageSize == null || pageSize < 1) pageSize = 10;

        LambdaQueryWrapper<Orders> wrapper = new LambdaQueryWrapper<>();
        if (status != null && status >= 0) {
            wrapper.eq(Orders::getStatus, status);
        }
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Orders::getOrderNo, keyword)
                    .or()
                    .like(Orders::getReceiverName, keyword));
        }
        wrapper.orderByDesc(Orders::getCreatedAt);

        Page<Orders> pageParam = new Page<>(page, pageSize);
        ordersMapper.selectPage(pageParam, wrapper);

        List<Map<String, Object>> records = new ArrayList<>();
        for (Orders order : pageParam.getRecords()) {
            Map<String, Object> detail = buildOrderDetail(order);
            User user = userMapper.selectById(order.getUserId());
            detail.put("userName", user != null ? user.getNickname() : null);
            records.add(detail);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("list", records);
        data.put("total", pageParam.getTotal());
        data.put("page", page);
        data.put("pageSize", pageSize);
        return Result.success(data);
    }

    public Result<?> adminDetail(Integer orderId) {
        Orders order = ordersMapper.selectById(orderId);
        if (order == null) {
            return Result.error("订单不存在");
        }
        Map<String, Object> detail = buildOrderDetail(order);
        User user = userMapper.selectById(order.getUserId());
        if (user != null) {
            user.setPassword(null);
            detail.put("userInfo", user);
        }
        return Result.success(detail);
    }

    public Result<?> ship(Integer orderId) {
        Orders order = ordersMapper.selectById(orderId);
        if (order == null) {
            return Result.error("订单不存在");
        }
        if (order.getStatus() != 1) {
            return Result.error("订单状态异常，无法发货");
        }
        order.setStatus(2);
        order.setShipTime(LocalDateTime.now());
        ordersMapper.updateById(order);
        return Result.success("发货成功", null);
    }

    private Map<String, Object> buildOrderDetail(Orders order) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", order.getId());
        map.put("orderNo", order.getOrderNo());
        map.put("userId", order.getUserId());
        map.put("receiverName", order.getReceiverName());
        map.put("receiverPhone", order.getReceiverPhone());
        map.put("receiverAddress", order.getReceiverAddress());
        map.put("totalAmount", order.getTotalAmount());
        map.put("payAmount", order.getPayAmount());
        map.put("status", order.getStatus());
        map.put("remark", order.getRemark());
        map.put("payTime", order.getPayTime());
        map.put("shipTime", order.getShipTime());
        map.put("receiveTime", order.getReceiveTime());
        map.put("createdAt", order.getCreatedAt());

        LambdaQueryWrapper<OrderItem> itemWrapper = new LambdaQueryWrapper<>();
        itemWrapper.eq(OrderItem::getOrderId, order.getId());
        List<OrderItem> items = orderItemMapper.selectList(itemWrapper);
        map.put("items", items);

        if (order.getStatus() == 3) {
            List<Integer> reviewedProductIds = new ArrayList<>();
            for (OrderItem item : items) {
                LambdaQueryWrapper<Review> rw = new LambdaQueryWrapper<>();
                rw.eq(Review::getOrderId, order.getId())
                        .eq(Review::getProductId, item.getProductId());
                if (reviewMapper.selectCount(rw) > 0) {
                    reviewedProductIds.add(item.getProductId());
                }
            }
            map.put("reviewedProductIds", reviewedProductIds);
            map.put("reviewed", !items.isEmpty() && reviewedProductIds.size() >= items.size());
        }

        return map;
    }

    private void restoreStock(Integer orderId) {
        LambdaQueryWrapper<OrderItem> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(OrderItem::getOrderId, orderId);
        List<OrderItem> items = orderItemMapper.selectList(wrapper);
        for (OrderItem item : items) {
            Product product = productMapper.selectById(item.getProductId());
            if (product != null) {
                product.setStock(product.getStock() + item.getQuantity());
                product.setSales(Math.max(0, product.getSales() - item.getQuantity()));
                productMapper.updateById(product);
            }
        }
    }

    private String generateOrderNo() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        int random = ThreadLocalRandom.current().nextInt(100000, 999999);
        return datePart + random;
    }
}
