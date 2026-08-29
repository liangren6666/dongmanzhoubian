package com.acgmall.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("review")
public class Review {

    private Integer id;
    private Integer userId;
    private Integer productId;
    private Integer orderId;
    private Integer rating;
    private String content;
    private String images;
    private Integer status;
    private LocalDateTime createdAt;

}
