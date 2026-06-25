package com.campuskart.api.cart.dto;

import com.campuskart.api.cart.domain.CartItem;
import java.math.BigDecimal;

public record CartItemResponse(
        Long id,
        Long productId,
        String productTitle,
        String productImageUrl,
        BigDecimal unitPrice,
        int quantity,
        BigDecimal lineTotal
) {



    public static CartItemResponse from(CartItem item) {
        BigDecimal unitPrice = item.getProduct().getPrice();
        BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));

        String imageUrl = item.getProduct().getImages().isEmpty()
                ? null
                : item.getProduct().getImages().get(0).getImageUrl();

        return new CartItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getTitle(),
                imageUrl,
                unitPrice,
                item.getQuantity(),
                lineTotal
        );
    }
}