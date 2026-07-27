package com.campuskart.api.payment.dto;

import jakarta.validation.constraints.NotNull;

public record ConfirmPaymentRequest(
        @NotNull(message = "Payment id is required")
        Long paymentId,

        String providerPaymentId
) {
}



