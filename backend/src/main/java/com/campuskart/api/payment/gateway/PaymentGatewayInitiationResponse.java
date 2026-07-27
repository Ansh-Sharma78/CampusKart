package com.campuskart.api.payment.gateway;

import com.campuskart.api.payment.domain.PaymentProvider;

public record PaymentGatewayInitiationResponse(
        PaymentProvider provider,
        String providerOrderId,
        String providerPaymentId
) {
}