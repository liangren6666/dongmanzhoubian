package com.acgmall.service;

import com.acgmall.common.Result;
import com.acgmall.entity.Address;
import com.acgmall.mapper.AddressMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    @Autowired
    private AddressMapper addressMapper;

    public Result<?> list(Integer userId) {
        LambdaQueryWrapper<Address> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Address::getUserId, userId)
               .orderByDesc(Address::getIsDefault)
               .orderByDesc(Address::getId);
        List<Address> addresses = addressMapper.selectList(wrapper);
        return Result.success(addresses);
    }

    public Result<?> add(Integer userId, Address address) {
        address.setUserId(userId);
        if (address.getIsDefault() != null && address.getIsDefault() == 1) {
            clearDefault(userId);
        }
        addressMapper.insert(address);
        return Result.success("添加成功", null);
    }

    public Result<?> update(Integer userId, Address address) {
        Address existing = addressMapper.selectById(address.getId());
        if (existing == null || !existing.getUserId().equals(userId)) {
            return Result.error("地址不存在");
        }
        address.setUserId(userId);
        if (address.getIsDefault() != null && address.getIsDefault() == 1) {
            clearDefault(userId);
        }
        addressMapper.updateById(address);
        return Result.success("更新成功", null);
    }

    public Result<?> delete(Integer id, Integer userId) {
        LambdaQueryWrapper<Address> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Address::getId, id).eq(Address::getUserId, userId);
        int rows = addressMapper.delete(wrapper);
        if (rows == 0) {
            return Result.error("地址不存在");
        }
        return Result.success("删除成功", null);
    }

    public Result<?> setDefault(Integer id, Integer userId) {
        Address address = addressMapper.selectById(id);
        if (address == null || !address.getUserId().equals(userId)) {
            return Result.error("地址不存在");
        }
        clearDefault(userId);
        address.setIsDefault(1);
        addressMapper.updateById(address);
        return Result.success("设置成功", null);
    }

    private void clearDefault(Integer userId) {
        LambdaUpdateWrapper<Address> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(Address::getUserId, userId)
               .set(Address::getIsDefault, 0);
        addressMapper.update(null, wrapper);
    }
}
