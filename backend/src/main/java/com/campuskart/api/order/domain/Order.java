package com.campuskart.api.order.domain;

import com.campuskart.api.address.domain.Address;
import com.campuskart.api.auth.domain.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_address_id")
    private Address deliveryAddress;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private OrderStatus status;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "recipient_name", nullable = false, length = 120)
    private String recipientName;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(name = "address_line1", nullable = false, length = 180)
    private String addressLine1;

    @Column(name = "address_line2", length = 180)
    private String addressLine2;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(name = "postal_code", nullable = false, length = 20)
    private String postalCode;

    @Column(nullable = false, length = 120)
    private String campus;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "cancelled_at")
    private Instant cancelledAt;

    protected Order() {
    }

    public Order(User user, Address address, BigDecimal subtotal) {
        this.user = user;
        this.deliveryAddress = address;
        this.status = OrderStatus.PENDING_PAYMENT;
        this.subtotal = subtotal;
        this.totalAmount = subtotal;

        this.recipientName = address.getRecipientName();
        this.phoneNumber = address.getPhoneNumber();
        this.addressLine1 = address.getLine1();
        this.addressLine2 = address.getLine2();
        this.city = address.getCity();
        this.state = address.getState();
        this.postalCode = address.getPostalCode();
        this.campus = address.getCampus();
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

    public void addItem(OrderItem item) {
        items.add(item);
        item.assignToOrder(this);
    }

    public void confirm() {
        status = OrderStatus.CONFIRMED;
    }

    public void cancel() {
        status = OrderStatus.CANCELLED;
        cancelledAt = Instant.now();
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public Address getDeliveryAddress() { return deliveryAddress; }
    public OrderStatus getStatus() { return status; }
    public BigDecimal getSubtotal() { return subtotal; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public String getRecipientName() { return recipientName; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getAddressLine1() { return addressLine1; }
    public String getAddressLine2() { return addressLine2; }
    public String getCity() { return city; }
    public String getState() { return state; }
    public String getPostalCode() { return postalCode; }
    public String getCampus() { return campus; }
    public List<OrderItem> getItems() { return items; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public Instant getCancelledAt() { return cancelledAt; }
}