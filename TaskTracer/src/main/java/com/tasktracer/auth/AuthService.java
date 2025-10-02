// src/main/java/com/tasktracer/auth/AuthService.java
package com.tasktracer.auth;

import com.tasktracer.auth.dto.*;
import com.tasktracer.security.JwtService;
import com.tasktracer.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Kullanıcı zaten var");
        }
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .tokenVersion(0)
                .build();
        userRepository.save(user);

        Map<String,Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("typ", "access");
        String access = jwtService.generateAccessToken(user.getUsername(), claims);
        String refresh = jwtService.generateRefreshToken(user.getUsername(), user.getTokenVersion());

        return new AuthResponse(access, refresh);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        Map<String,Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("typ", "access");
        String access = jwtService.generateAccessToken(user.getUsername(), claims);
        String refresh = jwtService.generateRefreshToken(user.getUsername(), user.getTokenVersion());
        return new AuthResponse(access, refresh);
    }

    public RefreshResponse refresh(RefreshRequest req) {
        String refreshToken = req.getRefreshToken();
        String username = jwtService.extractUsername(refreshToken);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        boolean ok = jwtService.isRefreshTokenValid(refreshToken, username, user.getTokenVersion());
        if (!ok) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Geçersiz refresh token");

        Map<String,Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("typ", "access");
        String newAccess = jwtService.generateAccessToken(user.getUsername(), claims);

        // İsteğe bağlı: refresh döndürüp ROTATE de edebilirsin
        return new RefreshResponse(newAccess);
    }

    // İsteğe bağlı: tüm cihazlarda çıkış (tokenVersion++)
    public void logoutAll(String username) {
        User u = userRepository.findByUsername(username).orElseThrow();
        u.setTokenVersion(u.getTokenVersion() + 1);
        userRepository.save(u);
    }
}
