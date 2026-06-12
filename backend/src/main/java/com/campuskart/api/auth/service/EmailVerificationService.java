package com.campuskart.api.auth.service;

import com.campuskart.api.auth.domain.EmailVerificationToken;
import com.campuskart.api.auth.domain.User;
import com.campuskart.api.auth.repository.EmailVerificationTokenRepository;
import com.campuskart.api.auth.repository.UserRepository;
import com.campuskart.api.common.BusinessException;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmailVerificationService {

    private final AuthProperties authProperties;
    private final EmailVerificationTokenRepository tokenRepository;
    private final TokenHashService tokenHashService;
    private final UserRepository userRepository;

    public EmailVerificationService(
            AuthProperties authProperties,
            EmailVerificationTokenRepository tokenRepository,
            TokenHashService tokenHashService,
            UserRepository userRepository
    ) {
        this.authProperties = authProperties;
        this.tokenRepository = tokenRepository;
        this.tokenHashService = tokenHashService;
        this.userRepository = userRepository;
    }

    @Transactional
    public String createToken(User user) {
        String rawToken = tokenHashService.generateToken();
        String tokenHash = tokenHashService.hash(rawToken);
        Instant expiresAt = Instant.now().plus(authProperties.verificationTokenTtl());

        tokenRepository.save(new EmailVerificationToken(user, tokenHash, expiresAt));

        return rawToken;
    }

    @Transactional
    public User verify(String token) {
        EmailVerificationToken verificationToken = tokenRepository.findByTokenHash(tokenHashService.hash(token))
                .orElseThrow(() -> new BusinessException("Invalid verification token", HttpStatus.BAD_REQUEST));

        if (verificationToken.getUsedAt() != null) {
            throw new BusinessException("Verification token has already been used", HttpStatus.BAD_REQUEST);
        }

        if (!verificationToken.getExpiresAt().isAfter(Instant.now())) {
            throw new BusinessException("Verification token has expired", HttpStatus.BAD_REQUEST);
        }

        User user = verificationToken.getUser();
        user.markEmailVerified();
        verificationToken.markUsed();

        return userRepository.save(user);
    }
}