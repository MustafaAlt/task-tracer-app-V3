package com.tasktracer.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.Objects;

@Service
public class JwtService {

    private final Key key;
    private final long accessExpMillis;
    private final String issuer;
    private final String audience;

    public JwtService(Environment env) {
        // ---- Secret'i birden fazla isimden okuyalım ----
        // Öncelik sırası: security.jwt.secret  -> security.jwt.secret-key -> ENV
        String secret = firstNonBlank(
                env.getProperty("security.jwt.secret"),
                env.getProperty("security.jwt.secret-key"),
                env.getProperty("SECURITY_JWT_SECRET"),      // env var
                env.getProperty("SECURITY_JWT_SECRET_KEY")    // env var (alternatif)
        );

        if (isBlank(secret)) {
            // Dev ortamı için fallback (PROD'da ENV/property şart)
            secret = "default_dev_secret_key_must_be_32_bytes!!";
            System.err.println("[WARN] JWT secret bulunamadı. DEV fallback kullanılıyor.");
        }

        // Base64 mü, düz mü? Önce Base64 decode dene; başarısızsa düz bytes kullan.
        byte[] secretBytes;
        try {
            secretBytes = Decoders.BASE64.decode(secret);
            if (secretBytes.length < 32) {
                throw new IllegalArgumentException("Base64 secret 256-bit (>=32 byte) olmalı.");
            }
        } catch (IllegalArgumentException base64Failed) {
            // düz text olarak kullan
            secretBytes = secret.getBytes();
            if (secretBytes.length < 32) {
                throw new IllegalArgumentException("security.jwt.secret(-key) en az 32 byte olmalı.");
            }
        }
        this.key = Keys.hmacShaKeyFor(secretBytes);

        // ---- Süreleri birden fazla isimden oku ----
        // access token (dakika): security.jwt.expiration-minutes -> security.jwt.access-exp-min -> 15 (default)
        long accessExpMin = parseLongOrDefault(
                firstNonBlank(env.getProperty("security.jwt.expiration-minutes"),
                        env.getProperty("security.jwt.access-exp-min"),
                        env.getProperty("SECURITY_JWT_ACCESS_EXP_MIN")),
                15L
        );
        this.accessExpMillis = accessExpMin * 60_000;

        // issuer/audience opsiyonel
        this.issuer = defaultString(env.getProperty("security.jwt.issuer"),
                env.getProperty("SECURITY_JWT_ISSUER"));
        this.audience = defaultString(env.getProperty("security.jwt.audience"),
                env.getProperty("SECURITY_JWT_AUDIENCE"));
    }

    public String generateAccessToken(String username, Map<String, Object> extraClaims) {
        Instant now = Instant.now();
        JwtBuilder builder = Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(username)
                .setIssuedAt(Date.from(now))
                .setExpiration(new Date(now.toEpochMilli() + accessExpMillis))
                .signWith(key, SignatureAlgorithm.HS256);

        if (!isBlank(issuer))   builder.setIssuer(issuer);
        if (!isBlank(audience)) builder.setAudience(audience);

        return builder.compact();
    }

    public String extractUsername(String token) {
        return parseAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, String username) {
        Claims claims = parseAllClaims(token);
        return Objects.equals(username, claims.getSubject()) && claims.getExpiration().after(new Date());
    }

    private Claims parseAllClaims(String token) {
        JwtParserBuilder pb = Jwts.parserBuilder().setSigningKey(key);
        if (!isBlank(issuer)) {
            pb.requireIssuer(issuer);
        }
        return pb.build().parseClaimsJws(token).getBody();
    }

    // ---- küçük yardımcılar ----
    private static String firstNonBlank(String... vals) {
        if (vals == null) return null;
        for (String v : vals) if (!isBlank(v)) return v;
        return null;
    }
    private static boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }
    private static String defaultString(String... vals) { String v = firstNonBlank(vals); return v == null ? "" : v; }
    private static long parseLongOrDefault(String s, long def) {
        try { return isBlank(s) ? def : Long.parseLong(s.trim()); } catch (Exception e) { return def; }
    }
}
