package com.acgmall.controller.admin;

import com.acgmall.common.Result;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/admin/file")
public class AdminFileController {

    @Value("${acg.upload.path:uploads}")
    private String uploadPath;

    @PostMapping("/upload")
    public Result<?> upload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return Result.error("请选择文件");
        }

        String originalName = file.getOriginalFilename();
        String ext = "";
        if (originalName != null && originalName.contains(".")) {
            ext = originalName.substring(originalName.lastIndexOf("."));
        }

        String[] allowedExts = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"};
        boolean valid = false;
        for (String allowed : allowedExts) {
            if (ext.equalsIgnoreCase(allowed)) {
                valid = true;
                break;
            }
        }
        if (!valid) {
            return Result.error("仅支持 jpg/png/gif/webp/svg 格式");
        }

        String fileName = UUID.randomUUID().toString().replace("-", "") + ext;

        File dir = new File(uploadPath);
        if (!dir.isAbsolute()) {
            dir = new File(System.getProperty("user.dir"), uploadPath);
        }
        if (!dir.exists()) {
            dir.mkdirs();
        }

        try {
            File dest = new File(dir, fileName);
            file.transferTo(dest);
            String url = "/api/uploads/" + fileName;
            return Result.success("上传成功", url);
        } catch (IOException e) {
            return Result.error("上传失败: " + e.getMessage());
        }
    }
}
