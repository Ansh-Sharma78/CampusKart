package com.campuskart.api.order.dto;

import com.campuskart.api.order.domain.OrderItem;
import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        Long productId,
        String productTitle,
        String productImageUrl,
        BigDecimal unitPrice,
        int quantity,
        BigDecimal lineTotal
) {

    public static OrderItemResponse from(OrderItem item) {
        return new OrderItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProductTitle(),
                item.getProductImageUrl(),
                item.getUnitPrice(),
                item.getQuantity(),
                item.getLineTotal()
        );
    }
}