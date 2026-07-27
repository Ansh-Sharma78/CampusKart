package com.campuskart.api.order.dto;

import jakarta.validation.constraints.NotNull;

public record PlaceOrderRequest(

        @NotNull(message = "Delivery address is required")
        Long addressId

) {
}