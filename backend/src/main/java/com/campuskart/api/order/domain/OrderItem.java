package com.campuskart.api.order.domain;

import com.campuskart.api.product.domain.Product;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "product_title", nullable = false, length = 140)
    private String productTitle;

    @Column(name = "product_image_url", length = 500)
    private String productImageUrl;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "line_total", nullable = false, precision = 12, scale = 2)
    private BigDecimal lineTotal;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected OrderItem() {
    }

    public OrderItem(Product product, String imageUrl, int quantity) {
        this.product = product;
        this.productTitle = product.getTitle();
        this.productImageUrl = imageUrl;
        this.unitPrice = product.getPrice();
        this.quantity = quantity;
        this.lineTotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
    }

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
    }

    void assignToOrder(Order order) {
        this.order = order;
    }

    public Long getId() { return id; }
    public Order getOrder() { return order; }
    public Product getProduct() { return product; }
    public String getProductTitle() { return productTitle; }
    public String getProductImageUrl() { return productImageUrl; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public int getQuantity() { return quantity; }
    public BigDecimal getLineTotal() { return lineTotal; }
    public Instant getCreatedAt() { return createdAt; }
}