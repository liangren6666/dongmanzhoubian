package com.acgmall.service;

import com.acgmall.common.JwtUtils;
import com.acgmall.common.Result;
import com.acgmall.entity.User;
import com.acgmall.mapper.UserMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private JwtUtils jwtUtils;

    public Result<?> login(String phone, String password) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getPhone, phone);
        User user = userMapper.selectOne(wrapper);
        if (user == null) {
            return Result.error("手机号未注册");
        }
        if (!user.getPassword().equals(password)) {
            return Result.error("密码错误");
        }
        if (user.getStatus() != 1) {
            return Result.error("账号已被禁用");
        }
        String token = jwtUtils.generateToken(user.getId(), "user");
        user.setPassword(null);
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("userInfo", user);
        return Result.success(data);
    }

    public Result<?> register(String phone, String password, String nickname) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getPhone, phone);
        Long count = userMapper.selectCount(wrapper);
        if (count > 0) {
            return Result.error("该手机号已注册");
        }
        User user = new User();
        user.setPhone(phone);
        user.setPassword(password);
        user.setNickname(nickname);
        user.setStatus(1);
        userMapper.insert(user);
        return Result.success("注册成功", null);
    }

    public Result<?> getProfile(Integer userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            return Result.error("用户不存在");
        }
        user.setPassword(null);
        return Result.success(user);
    }

    public Result<?> updateProfile(Integer userId, User updateData) {
        updateData.setId(userId);
        updateData.setPassword(null);
        userMapper.updateById(updateData);
        return Result.success("更新成功", null);
    }
}
