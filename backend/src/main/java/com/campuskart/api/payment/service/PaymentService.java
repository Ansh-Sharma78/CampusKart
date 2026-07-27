package com.campuskart.api.payment.service;

import com.campuskart.api.auth.domain.User;
import com.campuskart.api.auth.repository.UserRepository;
import com.campuskart.api.auth.security.UserPrincipal;
import com.campuskart.api.common.BusinessException;
import com.campuskart.api.order.domain.Order;
import com.campuskart.api.order.domain.OrderStatus;
import com.campuskart.api.order.repository.OrderRepository;
import com.campuskart.api.payment.domain.Payment;
import com.campuskart.api.payment.domain.PaymentStatus;
import com.campuskart.api.payment.dto.ConfirmPaymentRequest;
import com.campuskart.api.payment.dto.InitiatePaymentRequest;
import com.campuskart.api.payment.dto.PaymentResponse;
import com.campuskart.api.payment.gateway.PaymentGateway;
import com.campuskart.api.payment.gateway.PaymentGatewayConfirmationRequest;
import com.campuskart.api.payment.gateway.PaymentGatewayConfirmationResponse;
import com.campuskart.api.payment.gateway.PaymentGatewayInitiationRequest;
import com.campuskart.api.payment.gateway.PaymentGatewayInitiationResponse;
import com.campuskart.api.payment.repository.PaymentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class PaymentService {

    private static final String DEFAULT_CURRENCY = "INR";

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final PaymentGateway paymentGateway;

    public PaymentService(
            PaymentRepository paymentRepository,
            OrderRepository orderRepository,
            UserRepository userRepository,
            PaymentGateway paymentGateway
    ) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.paymentGateway = paymentGateway;
    }

    @Transactional
    public PaymentResponse initiatePayment(
            InitiatePaymentRequest request,
            UserPrincipal principal
    ) {
        User user = getCurrentUser(principal);

        Order order = orderRepository
                .findOwnedOrderForUpdate(request.orderId(), user)
                .orElseThrow(() -> new BusinessException(
                        "Order not found",
                        HttpStatus.NOT_FOUND
                ));

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new BusinessException(
                    "Cancelled orders cannot be paid",
                    HttpStatus.CONFLICT
            );
        }

        if (order.getStatus() == OrderStatus.CONFIRMED) {
            throw new BusinessException(
                    "Order is already confirmed",
                    HttpStatus.CONFLICT
            );
        }

        PaymentGatewayInitiationResponse gatewayResponse =
                paymentGateway.initiate(
                        new PaymentGatewayInitiationRequest(
                                order.getId(),
                                order.getTotalAmount(),
                                DEFAULT_CURRENCY
                        )
                );

        Payment payment = new Payment(
                order,
                user,
                gatewayResponse.provider(),
                order.getTotalAmount(),
                DEFAULT_CURRENCY,
                gatewayResponse.providerOrderId(),
                gatewayResponse.providerPaymentId()
        );

        Payment savedPayment = paymentRepository.save(payment);

        return PaymentResponse.from(savedPayment);
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentStatus(
            Long paymentId,
            UserPrincipal principal
    ) {
        User user = getCurrentUser(principal);

        Payment payment = paymentRepository.findByIdAndUser(paymentId, user)
                .orElseThrow(() -> new BusinessException(
                        "Payment not found",
                        HttpStatus.NOT_FOUND
                ));

        return PaymentResponse.from(payment);
    }

    @Transactional
    public PaymentResponse confirmPayment(
            ConfirmPaymentRequest request,
            UserPrincipal principal
    ) {
        User user = getCurrentUser(principal);

        Payment payment = paymentRepository
                .findOwnedPaymentForUpdate(request.paymentId(), user)
                .orElseThrow(() -> new BusinessException(
                        "Payment not found",
                        HttpStatus.NOT_FOUND
                ));

        if (payment.getStatus() == PaymentStatus.CONFIRMED) {
            throw new BusinessException(
                    "Payment is already confirmed",
                    HttpStatus.CONFLICT
            );
        }

        if (payment.getStatus() == PaymentStatus.FAILED) {
            throw new BusinessException(
                    "Failed payment cannot be confirmed",
                    HttpStatus.CONFLICT
            );
        }

        Order order = payment.getOrder();

        if (order.getStatus() != OrderStatus.PENDING_PAYMENT) {
            throw new BusinessException(
                    "Only pending-payment orders can be confirmed",
                    HttpStatus.CONFLICT
            );
        }

        String providerPaymentId = StringUtils.hasText(request.providerPaymentId())
                ? request.providerPaymentId()
                : payment.getProviderPaymentId();

        PaymentGatewayConfirmationResponse gatewayResponse =
                paymentGateway.confirm(
                        new PaymentGatewayConfirmationRequest(
                                payment.getProviderOrderId(),
                                providerPaymentId
                        )
                );

        if (gatewayResponse.successful()) {
            payment.confirm(gatewayResponse.providerPaymentId());
            order.confirm();
        } else {
            payment.fail(gatewayResponse.failureReason());
        }

        return PaymentResponse.from(payment);
    }

    private User getCurrentUser(UserPrincipal principal) {
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new BusinessException(
                        "Authenticated user not found",
                        HttpStatus.UNAUTHORIZED
                ));
    }
}