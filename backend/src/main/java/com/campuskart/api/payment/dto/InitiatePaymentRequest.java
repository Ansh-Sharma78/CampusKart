package com.campuskart.api.payment.dto;

import jakarta.validation.constraints.NotNull;

public record InitiatePaymentRequest(
        @NotNull(message = "Order id is required")
        Long orderId
) {
}