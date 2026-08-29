package com.acgmall.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("product")
public class Product {

    private Integer id;
    private Integer categoryId;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer stock;
    private Integer sales;
    private String mainImage;
    private String images;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
