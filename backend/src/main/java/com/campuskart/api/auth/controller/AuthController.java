package com.campuskart.api.auth.controller;

import com.campuskart.api.auth.dto.RegisterRequest;
import com.campuskart.api.auth.dto.RegisterResponse;
import com.campuskart.api.auth.dto.UserResponse;
import com.campuskart.api.auth.dto.VerifyEmailRequest;
import com.campuskart.api.auth.service.AuthService;
import com.campuskart.api.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.campuskart.api.auth.dto.AuthResponse;
import com.campuskart.api.auth.dto.LoginRequest;
import com.campuskart.api.auth.dto.LogoutRequest;
import com.campuskart.api.auth.dto.RefreshTokenRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ApiResponse<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success(
                "Registration successful. Verify your college email to continue.",
                authService.register(request)
        );
    }
    @PostMapping("/verify-email")
    public ApiResponse<UserResponse> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        return ApiResponse.success("Email verified successfully", authService.verifyEmail(request.token()));
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success("Login successful", authService.login(request));
    }
    @PostMapping("/refresh")
    public ApiResponse<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ApiResponse.success("Token refreshed successfully", authService.refresh(request.refreshToken()));
    }

    @PostMapping("/logout")
    public ApiResponse<Map<String, Boolean>> logout(@Valid @RequestBody LogoutRequest request) {
        authService.logout(request.refreshToken());
        return ApiResponse.success("Logout successful", Map.of("loggedOut", true));
    }
}