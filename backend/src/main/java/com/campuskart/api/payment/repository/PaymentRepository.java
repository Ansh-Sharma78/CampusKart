package com.campuskart.api.payment.repository;

import com.campuskart.api.auth.domain.User;
import com.campuskart.api.payment.domain.Payment;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @EntityGraph(attributePaths = {"order"})
    Optional<Payment> findByIdAndUser(Long id, User user);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @EntityGraph(attributePaths = {"order"})
    @Query("""
            SELECT payment
            FROM Payment payment
            WHERE payment.id = :paymentId
              AND payment.user = :user
            """)
    Optional<Payment> findOwnedPaymentForUpdate(
            @Param("paymentId") Long paymentId,
            @Param("user") User user
    );
}