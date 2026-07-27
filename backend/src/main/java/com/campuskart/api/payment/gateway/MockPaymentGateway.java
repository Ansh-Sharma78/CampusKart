package com.campuskart.api.payment.gateway;

import com.campuskart.api.payment.domain.PaymentProvider;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class MockPaymentGateway implements PaymentGateway {

    @Override
    public PaymentProvider provider() {
        return PaymentProvider.MOCK;
    }

    @Override
    public PaymentGatewayInitiationResponse initiate(
            PaymentGatewayInitiationRequest request
    ) {
        String providerOrderId = "mock_order_" + request.orderId() + "_"
                + UUID.randomUUID();

        String providerPaymentId = "mock_payment_" + UUID.randomUUID();

        return new PaymentGatewayInitiationResponse(
                PaymentProvider.MOCK,
                providerOrderId,
                providerPaymentId
        );
    }

    @Override
    public PaymentGatewayConfirmationResponse confirm(
            PaymentGatewayConfirmationRequest request
    ) {
        if (!StringUtils.hasText(request.providerPaymentId())) {
            return new PaymentGatewayConfirmationResponse(
                    false,
                    null,
                    "Provider payment id is required"
            );
        }

        return new PaymentGatewayConfirmationResponse(
                true,
                request.providerPaymentId(),
                null
        );
    }
}