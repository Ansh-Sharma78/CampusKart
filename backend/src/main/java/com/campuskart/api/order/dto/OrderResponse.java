package com.campuskart.api.order.dto;

import com.campuskart.api.order.domain.Order;
import com.campuskart.api.order.domain.OrderStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        OrderStatus status,
        BigDecimal subtotal,
        BigDecimal totalAmount,

        String recipientName,
        String phoneNumber,
        String addressLine1,
        String addressLine2,
        String city,
        String state,
        String postalCode,
        String campus,

        List<OrderItemResponse> items,
        Instant createdAt,
        Instant updatedAt,
        Instant cancelledAt
) {

    public static OrderResponse from(Order order) {
        List<OrderItemResponse> items = order.getItems()
                .stream()
                .map(OrderItemResponse::from)
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getStatus(),
                order.getSubtotal(),
                order.getTotalAmount(),
                order.getRecipientName(),
                order.getPhoneNumber(),
                order.getAddressLine1(),
                order.getAddressLine2(),
                order.getCity(),
                order.getState(),
                order.getPostalCode(),
                order.getCampus(),
                items,
                order.getCreatedAt(),
                order.getUpdatedAt(),
                order.getCancelledAt()
        );
    }
}