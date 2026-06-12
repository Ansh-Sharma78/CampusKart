package com.campuskart.api.common;

import org.springframework.http.HttpStatus;
//Creates a custom exception class.
//It extends RuntimeException, so services can throw it without declaring it in method signatures.
public class BusinessException extends RuntimeException {

    private final HttpStatus status;

    public BusinessException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}

//Why This File Exists
//Business rules often fail in expected ways.
//
//Examples:
//
//Email already exists
//Product not found
//Cart item quantity invalid
//Order cannot be cancelled
//Instead of returning generic server errors, services can throw: