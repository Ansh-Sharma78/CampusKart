package com.campuskart.api.payment.gateway;

import java.math.BigDecimal;

public record PaymentGatewayInitiationRequest(
        Long orderId,
        BigDecimal amount,
        String currency
) {
}