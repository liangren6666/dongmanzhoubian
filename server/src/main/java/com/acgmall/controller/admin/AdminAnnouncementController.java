package com.acgmall.controller.admin;

import com.acgmall.common.Result;
import com.acgmall.entity.Announcement;
import com.acgmall.service.AnnouncementService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/announcement")
public class AdminAnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    @Autowired
    private HttpServletRequest request;

    private Integer getCurrentAdminId() {
        return (Integer) request.getAttribute("adminId");
    }

    @GetMapping("/list")
    public Result<?> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        try {
            return announcementService.adminList(page, pageSize);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/add")
    public Result<?> add(@RequestBody Announcement announcement) {
        try {
            announcement.setAdminId(getCurrentAdminId());
            return announcementService.add(announcement);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/update")
    public Result<?> update(@RequestBody Announcement announcement) {
        try {
            return announcementService.update(announcement);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public Result<?> delete(@PathVariable Integer id) {
        try {
            return announcementService.delete(id);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
