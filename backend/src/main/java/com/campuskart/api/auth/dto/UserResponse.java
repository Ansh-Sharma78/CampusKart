package com.campuskart.api.auth.dto;

import com.campuskart.api.auth.domain.User;
import com.campuskart.api.auth.domain.UserRole;

public record UserResponse(
        Long id,
        String fullName,
        String email,
        UserRole role,
        boolean emailVerified
) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.isEmailVerified()
        );
    }
}