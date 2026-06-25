package com.campuskart.api.cart.controller;

import com.campuskart.api.auth.security.UserPrincipal;
import com.campuskart.api.cart.dto.AddCartItemRequest;
import com.campuskart.api.cart.dto.CartResponse;
import com.campuskart.api.cart.dto.UpdateCartItemRequest;
import com.campuskart.api.cart.service.CartService;
import com.campuskart.api.common.ApiResponse;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ApiResponse<CartResponse> getCart(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success(
                "Cart fetched successfully",
                cartService.getCart(principal)
        );
    }

    @PostMapping("/items")
    public ApiResponse<CartResponse> addItem(
            @Valid @RequestBody AddCartItemRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success(
                "Item added to cart successfully",
                cartService.addItem(request, principal)
        );
    }

    @PutMapping("/items/{itemId}")
    public ApiResponse<CartResponse> updateItem(
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success(
                "Cart item updated successfully",
                cartService.updateItem(itemId, request, principal)
        );
    }

    @DeleteMapping("/items/{itemId}")
    public ApiResponse<Map<String, Boolean>> removeItem(
            @PathVariable Long itemId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        cartService.removeItem(itemId, principal);

        return ApiResponse.success(
                "Cart item removed successfully",
                Map.of("removed", true)
        );
    }
}