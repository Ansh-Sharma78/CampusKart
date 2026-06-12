package com.campuskart.api.auth.dto;

public record AuthResponse(
        UserResponse user,
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresInSeconds
) {
}