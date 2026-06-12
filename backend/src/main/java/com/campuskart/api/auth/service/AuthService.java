package com.campuskart.api.auth.service;

import com.campuskart.api.auth.domain.User;
import com.campuskart.api.auth.domain.UserRole;
import com.campuskart.api.auth.dto.RegisterRequest;
import com.campuskart.api.auth.dto.RegisterResponse;
import com.campuskart.api.auth.dto.UserResponse;
import com.campuskart.api.auth.dto.AuthResponse;
import com.campuskart.api.auth.dto.LoginRequest;
import com.campuskart.api.auth.repository.UserRepository;
import com.campuskart.api.common.BusinessException;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class AuthService {

    private final AuthProperties authProperties;
    private final CollegeEmailPolicy collegeEmailPolicy;
    private final EmailVerificationService emailVerificationService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthService(
            AuthProperties authProperties,
            CollegeEmailPolicy collegeEmailPolicy,
            EmailVerificationService emailVerificationService,
            JwtService jwtService,
            PasswordEncoder passwordEncoder,
            RefreshTokenService refreshTokenService,
            UserRepository userRepository
    ) {
        this.authProperties = authProperties;
        this.collegeEmailPolicy = collegeEmailPolicy;
        this.emailVerificationService = emailVerificationService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenService = refreshTokenService;
        this.userRepository = userRepository;
    }

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        collegeEmailPolicy.validate(email);

        if (userRepository.existsByEmail(email)) {
            throw new BusinessException("Email is already registered", HttpStatus.CONFLICT);
        }

        UserRole role = resolveRequestedRole(request.role());
        User user = new User(request.fullName().trim(), email, passwordEncoder.encode(request.password()), role);
        User savedUser = userRepository.save(user);

        String verificationToken = emailVerificationService.createToken(savedUser);
        String devToken = authProperties.exposeDevVerificationToken() ? verificationToken : null;

        return new RegisterResponse(UserResponse.from(savedUser), true, devToken);
    }

    @Transactional
    public UserResponse verifyEmail(String token) {
        return UserResponse.from(emailVerificationService.verify(token));
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BusinessException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        if (!user.isEmailVerified()) {
            throw new BusinessException("Email verification is required before login", HttpStatus.FORBIDDEN);
        }

        return issueTokens(user);
    }

    @Transactional
    public AuthResponse refresh(String refreshToken) {
        User user = refreshTokenService.rotate(refreshToken);
        return issueTokens(user);
    }

    @Transactional
    public void logout(String refreshToken) {
        refreshTokenService.revoke(refreshToken);
    }

    private AuthResponse issueTokens(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = refreshTokenService.create(user);

        return new AuthResponse(
                UserResponse.from(user),
                accessToken,
                refreshToken,
                "Bearer",
                jwtService.accessTokenTtlSeconds()
        );
    }
    private UserRole resolveRequestedRole(UserRole requestedRole) {
        if (requestedRole == null) {
            return UserRole.STUDENT;
        }

        if (requestedRole == UserRole.ADMIN) {
            throw new BusinessException("Admin accounts cannot be self-registered", HttpStatus.BAD_REQUEST);
        }

        return requestedRole;
    }

    private String normalizeEmail(String email) {
        return email.toLowerCase(Locale.ROOT).trim();
    }


}