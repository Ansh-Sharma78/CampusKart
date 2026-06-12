package com.campuskart.api.auth.service;

import java.time.Duration;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.auth")
public record AuthProperties(
        String jwtSecret,
        Duration accessTokenTtl,
        Duration refreshTokenTtl,
        Duration verificationTokenTtl,
        List<String> allowedEmailDomains,
        boolean exposeDevVerificationToken
) {
}