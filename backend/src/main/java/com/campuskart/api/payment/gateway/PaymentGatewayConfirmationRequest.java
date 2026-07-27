package com.campuskart.api.payment.gateway;

public record PaymentGatewayConfirmationRequest(
        String providerOrderId,
        String providerPaymentId
) {
}