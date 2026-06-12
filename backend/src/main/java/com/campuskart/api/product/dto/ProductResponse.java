package com.campuskart.api.product.dto;

import com.campuskart.api.product.domain.Product;
import com.campuskart.api.product.domain.ProductCategory;
import com.campuskart.api.product.domain.ProductCondition;
import com.campuskart.api.product.domain.ProductStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record ProductResponse(
        Long id,
        Long sellerId,
        String sellerName,
        String title,
        String description,
        ProductCategory category,
        ProductCondition condition,
        BigDecimal price,
        String campus,
        int quantity,
        ProductStatus status,
        List<ProductImageResponse> images,
        Instant createdAt,
        Instant updatedAt
) {

    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getSeller().getId(),
                product.getSeller().getFullName(),
                product.getTitle(),
                product.getDescription(),
                product.getCategory(),
                product.getCondition(),
                product.getPrice(),
                product.getCampus(),
                product.getQuantity(),
                product.getStatus(),
                product.getImages()
                        .stream()
                        .map(ProductImageResponse::from)
                        .toList(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}