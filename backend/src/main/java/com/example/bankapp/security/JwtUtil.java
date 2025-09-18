package com.example.bankapp.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Component;

import com.example.bankapp.entity.User;

import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET_KEY = "MaSuperCleUltraSecreteQuiFaitPlusDe32Caractere123456"; // ⚠️ à mettre dans application.properties
    private final long EXPIRATION_TIME = 86400000; // 24h

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("role", user.getRole())
                .claim("id", user.getId())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }


    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }
    
    public Long extractId(String token) {
        return getClaims(token).get("id", Long.class);
    }

    public boolean isTokenValid(String token) {
        return !getClaims(token).getExpiration().before(new Date());
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }
}
