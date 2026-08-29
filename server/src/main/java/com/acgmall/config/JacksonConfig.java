package com.acgmall.config;

import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.format.DateTimeFormatter;

@Configuration
public class JacksonConfig {

    private static final String DATE_TIME_PATTERN = "yyyy-MM-dd HH:mm:ss";
    private static final String DATE_PATTERN = "yyyy-MM-dd";

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jackson2ObjectMapperBuilderCustomizer() {
        return builder -> {
            DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(DATE_TIME_PATTERN);
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern(DATE_PATTERN);

            JavaTimeModule module = new JavaTimeModule();
            module.addSerializer(java.time.LocalDateTime.class, new LocalDateTimeSerializer(dateTimeFormatter));
            module.addDeserializer(java.time.LocalDateTime.class, new LocalDateTimeDeserializer(dateTimeFormatter));
            module.addSerializer(java.time.LocalDate.class, new LocalDateSerializer(dateFormatter));
            module.addDeserializer(java.time.LocalDate.class, new LocalDateDeserializer(dateFormatter));

            builder.modules(module);
        };
    }
}
