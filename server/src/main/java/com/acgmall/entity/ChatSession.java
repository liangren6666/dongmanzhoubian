package com.acgmall.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("chat_session")
public class ChatSession {

    private Integer id;
    private Integer userId;
    private Integer productId;
    private String productName;
    private String lastMessage;
    private Integer unreadUser;
    private Integer unreadAdmin;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
