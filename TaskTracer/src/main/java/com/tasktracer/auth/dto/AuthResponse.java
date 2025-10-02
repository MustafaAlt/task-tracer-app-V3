// src/main/java/com/tasktracer/auth/dto/AuthResponse.java
package com.tasktracer.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;

    // (Opsiyonel) Eski tek-parametreli kullanımlar için yardımcı:
    public static AuthResponse ofAccessOnly(String accessToken) {
        return new AuthResponse(accessToken, null);
    }
    // İstersen şu ctor'u da ekleyebilirsin:
    // public AuthResponse(String accessToken) { this.accessToken = accessToken; }
}
