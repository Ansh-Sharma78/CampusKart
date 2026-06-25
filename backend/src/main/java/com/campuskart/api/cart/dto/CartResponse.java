package com.campuskart.api.cart.dto;

import com.campuskart.api.cart.domain.Cart;
import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
        Long id,
        List<CartItemResponse> items,
        BigDecimal subtotal
) {

    public static CartResponse from(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getItems()
                .stream()
                .map(CartItemResponse::from)
                .toList();

        BigDecimal subtotal = itemResponses.stream()
                .map(CartItemResponse::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(
                cart.getId(),
                itemResponses,
                subtotal
        );
    }
}