package com.lostfound.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Secret key for signing JWT
    private final Key SECRET_KEY = Keys.hmacShaKeyFor("mysecretkey12345mysecretkey12345".getBytes());

    // Token validity: 24 hours
    private final long JWT_EXPIRATION = 24 * 60 * 60 * 1000;

    // Generate token for a given email
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract email (subject) from token
    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    // Validate token: check expiration
    public boolean validateToken(String token) {
        return !getClaims(token).getExpiration().before(new Date());
    }

    // Helper: parse claims
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
