package com.acgmall.service;

import com.acgmall.common.Result;
import com.acgmall.entity.Cart;
import com.acgmall.entity.Product;
import com.acgmall.mapper.CartMapper;
import com.acgmall.mapper.ProductMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CartService {

    @Autowired
    private CartMapper cartMapper;

    @Autowired
    private ProductMapper productMapper;

    public Result<?> list(Integer userId) {
        LambdaQueryWrapper<Cart> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Cart::getUserId, userId);
        List<Cart> cartList = cartMapper.selectList(wrapper);

        List<Map<String, Object>> result = new ArrayList<>();
        for (Cart cart : cartList) {
            Product product = productMapper.selectById(cart.getProductId());
            if (product == null) continue;
            Map<String, Object> map = new HashMap<>();
            map.put("id", cart.getId());
            map.put("productId", cart.getProductId());
            map.put("productName", product.getName());
            map.put("productImage", product.getMainImage());
            map.put("price", product.getPrice());
            map.put("quantity", cart.getQuantity());
            map.put("selected", cart.getSelected() == 1);
            map.put("stock", product.getStock());
            result.add(map);
        }
        return Result.success(result);
    }

    public Result<?> add(Integer userId, Integer productId, Integer quantity) {
        if (quantity == null || quantity < 1) quantity = 1;

        Product product = productMapper.selectById(productId);
        if (product == null || product.getStatus() != 1) {
            return Result.error("商品不存在或已下架");
        }

        LambdaQueryWrapper<Cart> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Cart::getUserId, userId).eq(Cart::getProductId, productId);
        Cart existing = cartMapper.selectOne(wrapper);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + quantity);
            cartMapper.updateById(existing);
        } else {
            Cart cart = new Cart();
            cart.setUserId(userId);
            cart.setProductId(productId);
            cart.setQuantity(quantity);
            cart.setSelected(1);
            cartMapper.insert(cart);
        }
        return Result.success("添加成功", null);
    }

    public Result<?> update(Integer id, Integer userId, Integer quantity, Integer selected) {
        LambdaQueryWrapper<Cart> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Cart::getId, id).eq(Cart::getUserId, userId);
        Cart cart = cartMapper.selectOne(wrapper);
        if (cart == null) {
            return Result.error("购物车项不存在");
        }
        if (quantity != null) {
            cart.setQuantity(quantity);
        }
        if (selected != null) {
            cart.setSelected(selected);
        }
        cartMapper.updateById(cart);
        return Result.success("更新成功", null);
    }

    public Result<?> delete(Integer id, Integer userId) {
        LambdaQueryWrapper<Cart> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Cart::getId, id).eq(Cart::getUserId, userId);
        int rows = cartMapper.delete(wrapper);
        if (rows == 0) {
            return Result.error("购物车项不存在");
        }
        return Result.success("删除成功", null);
    }

    public Result<?> selectAll(Integer userId, Boolean selected) {
        LambdaUpdateWrapper<Cart> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(Cart::getUserId, userId)
               .set(Cart::getSelected, Boolean.TRUE.equals(selected) ? 1 : 0);
        cartMapper.update(null, wrapper);
        return Result.success("操作成功", null);
    }
}
