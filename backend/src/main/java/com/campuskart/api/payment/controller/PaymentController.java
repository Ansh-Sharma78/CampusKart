package com.campuskart.api.payment.controller;

import com.campuskart.api.auth.security.UserPrincipal;
import com.campuskart.api.common.ApiResponse;
import com.campuskart.api.payment.dto.ConfirmPaymentRequest;
import com.campuskart.api.payment.dto.InitiatePaymentRequest;
import com.campuskart.api.payment.dto.PaymentResponse;
import com.campuskart.api.payment.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/initiate")
    public ApiResponse<PaymentResponse> initiatePayment(
            @Valid @RequestBody InitiatePaymentRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success(
                "Payment initiated successfully",
                paymentService.initiatePayment(request, principal)
        );
    }

    @GetMapping("/{paymentId}/status")
    public ApiResponse<PaymentResponse> getPaymentStatus(
            @PathVariable Long paymentId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success(
                "Payment status fetched successfully",
                paymentService.getPaymentStatus(paymentId, principal)
        );
    }

    @PostMapping("/confirm")
    public ApiResponse<PaymentResponse> confirmPayment(
            @Valid @RequestBody ConfirmPaymentRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success(
                "Payment confirmation processed successfully",
                paymentService.confirmPayment(request, principal)
        );
    }
}