package com.campuskart.api.cart.repository;

import com.campuskart.api.auth.domain.User;
import com.campuskart.api.cart.domain.Cart;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {

    @EntityGraph(attributePaths = {
            "items",
            "items.product",
            "items.product.images"
    })
    Optional<Cart> findByUser(User user); //SELECT * FROM carts WHERE user_id = ?
}