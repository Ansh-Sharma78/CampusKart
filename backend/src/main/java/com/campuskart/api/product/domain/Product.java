package com.campuskart.api.product.domain;

import com.campuskart.api.auth.domain.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Column(nullable = false, length = 140)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 60)
    private ProductCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_condition", nullable = false, length = 40)
    private ProductCondition condition;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, length = 120)
    private String campus;

    @Column(nullable = false)
    private int quantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private ProductStatus status;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Product() {
    }

    public Product(
            User seller,
            String title,
            String description,
            ProductCategory category,
            ProductCondition condition,
            BigDecimal price,
            String campus,
            int quantity
    ) {
        this.seller = seller;
        this.title = title;
        this.description = description;
        this.category = category;
        this.condition = condition;
        this.price = price;
        this.campus = campus;
        this.quantity = quantity;
        this.status = ProductStatus.ACTIVE;
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

    public Long getId() {
        return id;
    }

    public User getSeller() {
        return seller;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public ProductCategory getCategory() {
        return category;
    }

    public ProductCondition getCondition() {
        return condition;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getCampus() {
        return campus;
    }

    public int getQuantity() {
        return quantity;
    }

    public ProductStatus getStatus() {
        return status;
    }

    public List<ProductImage> getImages() {
        return images;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void updateDetails(
            String title,
            String description,
            ProductCategory category,
            ProductCondition condition,
            BigDecimal price,
            String campus,
            int quantity,
            ProductStatus status
    ) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.condition = condition;
        this.price = price;
        this.campus = campus;
        this.quantity = quantity;
        this.status = status;
    }

    public void markDeleted() {
        this.status = ProductStatus.DELETED;
    }

    public void addImage(ProductImage image) {
        images.add(image);
        image.assignToProduct(this);
    }

    public void clearImages() {
        images.clear();
    }
}