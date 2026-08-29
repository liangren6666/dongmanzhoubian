package com.acgmall.config;

import com.acgmall.interceptor.AdminAuthInterceptor;
import com.acgmall.interceptor.UserAuthInterceptor;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

import java.io.File;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Resource
    private UserAuthInterceptor userAuthInterceptor;

    @Resource
    private AdminAuthInterceptor adminAuthInterceptor;

    @Value("${acg.upload.path:uploads}")
    private String uploadPath;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(userAuthInterceptor)
                .addPathPatterns(
                        "/user/profile",
                        "/cart/**",
                        "/address/**",
                        "/order/**",
                        "/review/add",
                        "/chat/**"
                );

        registry.addInterceptor(adminAuthInterceptor)
                .addPathPatterns("/admin/**")
                .excludePathPatterns("/admin/login");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        File dir = new File(uploadPath);
        if (!dir.isAbsolute()) {
            dir = new File(System.getProperty("user.dir"), uploadPath);
        }
        String location = "file:" + dir.getAbsolutePath() + File.separator;
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location);
    }

}
