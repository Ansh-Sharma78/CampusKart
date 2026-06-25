package com.campuskart.api.cart.repository;

import com.campuskart.api.cart.domain.Cart;
import com.campuskart.api.cart.domain.CartItem;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByIdAndCart(Long id, Cart cart);
}