package com.campuskart.api.order.repository;

import com.campuskart.api.auth.domain.User;
import com.campuskart.api.order.domain.Order;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = {"items", "items.product"})
    List<Order> findByUserOrderByCreatedAtDesc(User user);  //Returns the user’s history, newest order first.

    @EntityGraph(attributePaths = {"items", "items.product"})
    Optional<Order> findByIdAndUser(Long id, User user);  //Returns an order only when its ID and owner both match.

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @EntityGraph(attributePaths = {"items", "items.product"})
    @Query("""
            SELECT DISTINCT orderEntity
            FROM Order orderEntity
            WHERE orderEntity.id = :orderId
              AND orderEntity.user = :user
            """)
    Optional<Order> findOwnedOrderForUpdate(
            @Param("orderId") Long orderId,
            @Param("user") User user  //Locks the order during cancellation. Without the lock, two cancellation requests could restore stock twice.
    );
}