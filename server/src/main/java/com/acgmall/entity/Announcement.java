package com.acgmall.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("announcement")
public class Announcement {

    private Integer id;
    private String title;
    private String content;
    private Integer adminId;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
