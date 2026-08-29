package com.acgmall.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("chat_message")
public class ChatMessage {

    private Integer id;
    private Integer sessionId;
    private String senderType;
    private Integer senderId;
    private String content;
    private LocalDateTime createdAt;

}
