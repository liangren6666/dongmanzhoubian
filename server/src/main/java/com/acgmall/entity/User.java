package com.acgmall.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("user")
public class User {

    private Integer id;
    private String phone;
    private String password;
    private String nickname;
    private String avatar;
    private Integer gender;
    private LocalDate birthday;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
