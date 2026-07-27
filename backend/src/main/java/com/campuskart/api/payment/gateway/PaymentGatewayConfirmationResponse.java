package com.campuskart.api.payment.gateway;

public record PaymentGatewayConfirmationResponse(
        boolean successful,
        String providerPaymentId,
        String failureReason
) {
}