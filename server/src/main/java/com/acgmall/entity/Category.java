package com.acgmall.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("category")
public class Category {

    private Integer id;
    private String name;
    private String icon;
    private Integer sortOrder;
    private Integer status;
    private LocalDateTime createdAt;

}
