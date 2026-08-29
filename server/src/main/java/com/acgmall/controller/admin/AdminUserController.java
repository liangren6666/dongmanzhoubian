package com.acgmall.controller.admin;

import com.acgmall.common.Result;
import com.acgmall.entity.Orders;
import com.acgmall.entity.User;
import com.acgmall.mapper.OrdersMapper;
import com.acgmall.mapper.UserMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/admin/user")
public class AdminUserController {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private OrdersMapper ordersMapper;

    @GetMapping("/list")
    public Result<?> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        try {
            Page<User> userPage = new Page<>(page, pageSize);
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            if (keyword != null && !keyword.isEmpty()) {
                wrapper.like(User::getPhone, keyword).or().like(User::getNickname, keyword);
            }
            if (status != null) {
                wrapper.eq(User::getStatus, status);
            }
            wrapper.orderByDesc(User::getCreatedAt);
            userMapper.selectPage(userPage, wrapper);

            List<Map<String, Object>> userList = new ArrayList<>();
            for (User user : userPage.getRecords()) {
                Map<String, Object> userMap = new LinkedHashMap<>();
                userMap.put("id", user.getId());
                userMap.put("phone", user.getPhone());
                userMap.put("nickname", user.getNickname());
                userMap.put("avatar", user.getAvatar());
                userMap.put("gender", user.getGender());
                userMap.put("status", user.getStatus());

                LambdaQueryWrapper<Orders> orderWrapper = new LambdaQueryWrapper<>();
                orderWrapper.eq(Orders::getUserId, user.getId());
                Long orderCount = ordersMapper.selectCount(orderWrapper);
                userMap.put("orderCount", orderCount);

                LambdaQueryWrapper<Orders> spentWrapper = new LambdaQueryWrapper<>();
                spentWrapper.eq(Orders::getUserId, user.getId())
                        .in(Orders::getStatus, Arrays.asList(1, 2, 3));
                List<Orders> paidOrders = ordersMapper.selectList(spentWrapper);
                BigDecimal totalSpent = paidOrders.stream()
                        .map(Orders::getPayAmount)
                        .filter(Objects::nonNull)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                userMap.put("totalSpent", totalSpent);

                userMap.put("createdAt", user.getCreatedAt());
                userList.add(userMap);
            }

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("list", userList);
            result.put("total", userPage.getTotal());
            result.put("page", page);
            result.put("pageSize", pageSize);
            return Result.success(result);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/update")
    public Result<?> update(@RequestBody User user) {
        try {
            User updateUser = new User();
            updateUser.setId(user.getId());
            updateUser.setStatus(user.getStatus());
            userMapper.updateById(updateUser);
            return Result.success("修改成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public Result<?> delete(@PathVariable Integer id) {
        try {
            userMapper.deleteById(id);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
