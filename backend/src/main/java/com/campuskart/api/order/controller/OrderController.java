package com.campuskart.api.order.controller;

import com.campuskart.api.auth.security.UserPrincipal;
import com.campuskart.api.common.ApiResponse;
import com.campuskart.api.order.dto.OrderResponse;
import com.campuskart.api.order.dto.PlaceOrderRequest;
import com.campuskart.api.order.service.OrderService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<OrderResponse> placeOrder(
            @Valid @RequestBody PlaceOrderRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success(
                "Order placed successfully",
                orderService.placeOrder(request, principal)
        );
    }

    @GetMapping
    public ApiResponse<List<OrderResponse>> listOrders(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success(
                "Orders fetched successfully",
                orderService.listOrders(principal)
        );
    }

    @GetMapping("/{orderId}")
    public ApiResponse<OrderResponse> getOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success(
                "Order fetched successfully",
                orderService.getOrder(orderId, principal)
        );
    }

    @PostMapping("/{orderId}/cancel")
    public ApiResponse<OrderResponse> cancelOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success(
                "Order cancelled successfully",
                orderService.cancelOrder(orderId, principal)
        );
    }
}