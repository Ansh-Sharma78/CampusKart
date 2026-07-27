package com.campuskart.api.payment.dto;

import com.campuskart.api.payment.domain.Payment;
import com.campuskart.api.payment.domain.PaymentProvider;
import com.campuskart.api.payment.domain.PaymentStatus;
import java.math.BigDecimal;
import java.time.Instant;

public record PaymentResponse(
        Long id,
        Long orderId,
        PaymentProvider provider,
        PaymentStatus status,
        BigDecimal amount,
        String currency,
        String providerOrderId,
        String providerPaymentId,
        String failureReason,
        Instant createdAt,
        Instant updatedAt,
        Instant confirmedAt,
        Instant failedAt
) {

    public static PaymentResponse from(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getOrder().getId(),
                payment.getProvider(),
                payment.getStatus(),
                payment.getAmount(),
                payment.getCurrency(),
                payment.getProviderOrderId(),
                payment.getProviderPaymentId(),
                payment.getFailureReason(),
                payment.getCreatedAt(),
                payment.getUpdatedAt(),
                payment.getConfirmedAt(),
                payment.getFailedAt()
        );
    }
}