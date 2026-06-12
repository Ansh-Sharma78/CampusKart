package com.campuskart.api.auth.service;

import com.campuskart.api.common.BusinessException;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class CollegeEmailPolicy {

    private final AuthProperties authProperties;

    public CollegeEmailPolicy(AuthProperties authProperties) {
        this.authProperties = authProperties;
    }

    public void validate(String email) {
        String normalizedEmail = email.toLowerCase(Locale.ROOT).trim();
        int atIndex = normalizedEmail.lastIndexOf('@');

        if (atIndex < 1 || atIndex == normalizedEmail.length() - 1) {
            throw new BusinessException("A valid college email is required", HttpStatus.BAD_REQUEST);
        }

        String domain = normalizedEmail.substring(atIndex + 1);
        boolean allowed = authProperties.allowedEmailDomains()
                .stream()
                .map(value -> value.toLowerCase(Locale.ROOT).trim())
                .anyMatch(domain::endsWith);

        if (!allowed) {
            throw new BusinessException("Email must belong to an allowed college domain", HttpStatus.BAD_REQUEST);
        }
    }
}