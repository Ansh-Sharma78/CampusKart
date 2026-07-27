package com.campuskart.api.payment.gateway;

import com.campuskart.api.payment.domain.PaymentProvider;

public interface PaymentGateway {

    PaymentProvider provider();

    PaymentGatewayInitiationResponse initiate(
            PaymentGatewayInitiationRequest request
    );

    PaymentGatewayConfirmationResponse confirm(
            PaymentGatewayConfirmationRequest request
    );
}