package com.campuskart.api.product.dto;

import com.campuskart.api.product.domain.ProductImage;

public record ProductImageResponse(
        Long id,
        String imageUrl,
        String fileName,
        String contentType,
        int sortOrder
) {

    public static ProductImageResponse from(ProductImage image) {
        return new ProductImageResponse(
                image.getId(),
                image.getImageUrl(),
                image.getFileName(),
                image.getContentType(),
                image.getSortOrder()
        );
    }
}