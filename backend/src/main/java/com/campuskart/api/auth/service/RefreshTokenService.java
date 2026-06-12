package com.campuskart.api.auth.service;

import com.campuskart.api.auth.domain.RefreshToken;
import com.campuskart.api.auth.domain.User;
import com.campuskart.api.auth.repository.RefreshTokenRepository;
import com.campuskart.api.common.BusinessException;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RefreshTokenService {

    private final AuthProperties authProperties;
    private final RefreshTokenRepository refreshTokenRepository;
    private final TokenHashService tokenHashService;

    public RefreshTokenService(
            AuthProperties authProperties,
            RefreshTokenRepository refreshTokenRepository,
            TokenHashService tokenHashService
    ) {
        this.authProperties = authProperties;
        this.refreshTokenRepository = refreshTokenRepository;
        this.tokenHashService = tokenHashService;
    }

    @Transactional
    public String create(User user) {
        String rawToken = tokenHashService.generateToken();
        String tokenHash = tokenHashService.hash(rawToken);
        Instant expiresAt = Instant.now().plus(authProperties.refreshTokenTtl());

        refreshTokenRepository.save(new RefreshToken(user, tokenHash, expiresAt));

        return rawToken;
    }

    @Transactional
    public User rotate(String rawRefreshToken) {
        RefreshToken refreshToken = findActive(rawRefreshToken);
        refreshToken.revoke();

        return refreshToken.getUser();
    }

    @Transactional
    public void revoke(String rawRefreshToken) {
        RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(tokenHashService.hash(rawRefreshToken))
                .orElseThrow(() -> new BusinessException("Invalid refresh token", HttpStatus.UNAUTHORIZED));

        if (refreshToken.getRevokedAt() == null) {
            refreshToken.revoke();
        }
    }

    private RefreshToken findActive(String rawRefreshToken) {
        RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(tokenHashService.hash(rawRefreshToken))
                .orElseThrow(() -> new BusinessException("Invalid refresh token", HttpStatus.UNAUTHORIZED));

        if (!refreshToken.isActive(Instant.now())) {
            throw new BusinessException("Refresh token is expired or revoked", HttpStatus.UNAUTHORIZED);
        }

        return refreshToken;
    }
}