package com.acgmall.interceptor;

import com.acgmall.common.JwtUtils;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.HashMap;
import java.util.Map;

@Component
public class AdminAuthInterceptor implements HandlerInterceptor {

    @Resource
    private JwtUtils jwtUtils;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendError(response, 401, "未登录，请先登录");
            return false;
        }

        String token = authHeader.substring(7);
        DecodedJWT jwt = jwtUtils.parseToken(token);
        if (jwt == null) {
            sendError(response, 401, "登录已过期，请重新登录");
            return false;
        }

        String role = jwt.getClaim("role").asString();
        if (!"admin".equals(role)) {
            sendError(response, 401, "无管理员权限");
            return false;
        }

        Integer adminId = jwt.getClaim("id").asInt();
        request.setAttribute("adminId", adminId);
        return true;
    }

    private void sendError(HttpServletResponse response, int code, String message) throws Exception {
        response.setStatus(code);
        response.setContentType("application/json;charset=UTF-8");
        Map<String, Object> result = new HashMap<>();
        result.put("code", code);
        result.put("message", message);
        result.put("data", null);
        response.getWriter().write(objectMapper.writeValueAsString(result));
    }

}
