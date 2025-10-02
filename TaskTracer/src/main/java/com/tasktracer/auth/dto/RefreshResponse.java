// src/main/java/com/tasktracer/auth/dto/RefreshResponse.java
package com.tasktracer.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RefreshResponse {
    private String accessToken;
}