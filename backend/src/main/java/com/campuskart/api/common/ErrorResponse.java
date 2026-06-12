package com.campuskart.api.common;

import java.time.Instant;
import java.util.List;
//We use it because one request can have multiple validation errors.
public record ErrorResponse(
        boolean success,
        String message,
        String path,
        List<FieldViolation> errors,
        Instant timestamp
) {

    public static ErrorResponse of(String message, String path, List<FieldViolation> errors) {
        return new ErrorResponse(false, message, path, errors, Instant.now());
    }
}