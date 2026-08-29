package com.acgmall.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("cart")
public class Cart {

    private Integer id;
    private Integer userId;
    private Integer productId;
    private Integer quantity;
    private Integer selected;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
