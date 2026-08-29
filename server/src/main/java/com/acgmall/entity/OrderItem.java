package com.acgmall.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("order_item")
public class OrderItem {

    private Integer id;
    private Integer orderId;
    private Integer productId;
    private String productName;
    private String productImage;
    private BigDecimal price;
    private Integer quantity;

}
