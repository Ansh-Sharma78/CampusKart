package com.campuskart.api.auth.dto;

public record RegisterResponse(
        UserResponse user,
        boolean emailVerificationRequired,
        String devVerificationToken
) {
}