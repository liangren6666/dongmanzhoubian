package com.acgmall.service;

import com.acgmall.common.Result;
import com.acgmall.entity.Announcement;
import com.acgmall.mapper.AnnouncementMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementMapper announcementMapper;

    public Result<?> list(Integer page, Integer pageSize) {
        if (page == null || page < 1) page = 1;
        if (pageSize == null || pageSize < 1) pageSize = 10;

        LambdaQueryWrapper<Announcement> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Announcement::getStatus, 1)
               .orderByDesc(Announcement::getCreatedAt);

        Page<Announcement> pageParam = new Page<>(page, pageSize);
        announcementMapper.selectPage(pageParam, wrapper);

        Map<String, Object> data = new HashMap<>();
        data.put("list", pageParam.getRecords());
        data.put("total", pageParam.getTotal());
        data.put("page", page);
        data.put("pageSize", pageSize);
        return Result.success(data);
    }

    public Result<?> detail(Integer id) {
        Announcement announcement = announcementMapper.selectById(id);
        if (announcement == null) {
            return Result.error("公告不存在");
        }
        return Result.success(announcement);
    }

    public Result<?> adminList(Integer page, Integer pageSize) {
        if (page == null || page < 1) page = 1;
        if (pageSize == null || pageSize < 1) pageSize = 10;

        LambdaQueryWrapper<Announcement> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByDesc(Announcement::getCreatedAt);

        Page<Announcement> pageParam = new Page<>(page, pageSize);
        announcementMapper.selectPage(pageParam, wrapper);

        Map<String, Object> data = new HashMap<>();
        data.put("list", pageParam.getRecords());
        data.put("total", pageParam.getTotal());
        data.put("page", page);
        data.put("pageSize", pageSize);
        return Result.success(data);
    }

    public Result<?> add(Announcement announcement) {
        announcement.setCreatedAt(LocalDateTime.now());
        announcementMapper.insert(announcement);
        return Result.success("添加成功", null);
    }

    public Result<?> update(Announcement announcement) {
        announcementMapper.updateById(announcement);
        return Result.success("更新成功", null);
    }

    public Result<?> delete(Integer id) {
        announcementMapper.deleteById(id);
        return Result.success("删除成功", null);
    }
}
