package com.campuskart.api.payment.domain;

import com.campuskart.api.auth.domain.User;
import com.campuskart.api.order.domain.Order;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private PaymentProvider provider;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private PaymentStatus status;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 10)
    private String currency;

    @Column(name = "provider_order_id", length = 120)
    private String providerOrderId;

    @Column(name = "provider_payment_id", length = 120)
    private String providerPaymentId;

    @Column(name = "failure_reason", length = 500)
    private String failureReason;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "confirmed_at")
    private Instant confirmedAt;

    @Column(name = "failed_at")
    private Instant failedAt;

    protected Payment() {
    }

    public Payment(
            Order order,
            User user,
            PaymentProvider provider,
            BigDecimal amount,
            String currency,
            String providerOrderId,
            String providerPaymentId
    ) {
        this.order = order;
        this.user = user;
        this.provider = provider;
        this.status = PaymentStatus.INITIATED;
        this.amount = amount;
        this.currency = currency;
        this.providerOrderId = providerOrderId;
        this.providerPaymentId = providerPaymentId;
    }

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public void confirm(String confirmedProviderPaymentId) {
        status = PaymentStatus.CONFIRMED;
        providerPaymentId = confirmedProviderPaymentId;
        confirmedAt = Instant.now();
        failureReason = null;
    }

    public void fail(String reason) {
        status = PaymentStatus.FAILED;
        failedAt = Instant.now();
        failureReason = reason;
    }

    public Long getId() {
        return id;
    }

    public Order getOrder() {
        return order;
    }

    public User getUser() {
        return user;
    }

    public PaymentProvider getProvider() {
        return provider;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getCurrency() {
        return currency;
    }

    public String getProviderOrderId() {
        return providerOrderId;
    }

    public String getProviderPaymentId() {
        return providerPaymentId;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public Instant getConfirmedAt() {
        return confirmedAt;
    }

    public Instant getFailedAt() {
        return failedAt;
    }
}