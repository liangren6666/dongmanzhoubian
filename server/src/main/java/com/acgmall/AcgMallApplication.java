package com.acgmall;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.acgmall.mapper")
public class AcgMallApplication {

    public static void main(String[] args) {
        SpringApplication.run(AcgMallApplication.class, args);
    }

}
