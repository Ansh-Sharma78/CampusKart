package com.campuskart.api.common;

public record FieldViolation(
        String field,
        String message
) {
}