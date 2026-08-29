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
@TableName("orders")
public class Orders {

    private Integer id;
    private String orderNo;
    private Integer userId;
    private String receiverName;
    private String receiverPhone;
    private String receiverAddress;
    private BigDecimal totalAmount;
    private BigDecimal payAmount;
    private Integer status;
    private String remark;
    private LocalDateTime payTime;
    private LocalDateTime shipTime;
    private LocalDateTime receiveTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
