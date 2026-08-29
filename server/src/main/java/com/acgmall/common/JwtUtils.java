package com.acgmall.common;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtils {

    @Value("${acg.jwt.secret}")
    private String secret;

    @Value("${acg.jwt.expire}")
    private long expire;

    public String generateToken(Integer id, String role) {
        Date expireDate = new Date(System.currentTimeMillis() + expire * 1000);
        return JWT.create()
                .withClaim("id", id)
                .withClaim("role", role)
                .withExpiresAt(expireDate)
                .sign(Algorithm.HMAC256(secret));
    }

    public DecodedJWT parseToken(String token) {
        try {
            return JWT.require(Algorithm.HMAC256(secret))
                    .build()
                    .verify(token);
        } catch (Exception e) {
            return null;
        }
    }

    public Integer getIdFromToken(String token) {
        DecodedJWT jwt = parseToken(token);
        return jwt != null ? jwt.getClaim("id").asInt() : null;
    }

    public String getRoleFromToken(String token) {
        DecodedJWT jwt = parseToken(token);
        return jwt != null ? jwt.getClaim("role").asString() : null;
    }

}
