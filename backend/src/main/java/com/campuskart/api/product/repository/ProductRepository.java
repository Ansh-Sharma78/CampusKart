package com.campuskart.api.product.repository;

import com.campuskart.api.auth.domain.User;
import com.campuskart.api.product.domain.Product;
import com.campuskart.api.product.domain.ProductCategory;
import com.campuskart.api.product.domain.ProductStatus;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @EntityGraph(attributePaths = "images")
    List<Product> findByStatusOrderByCreatedAtDesc(ProductStatus status);  //Show all ACTIVE products newest first.

    @EntityGraph(attributePaths = "images")
    List<Product> findByCategoryAndStatusOrderByCreatedAtDesc(   //Show active products in ? category.
            ProductCategory category,
            ProductStatus status
    );

    @EntityGraph(attributePaths = "images")
    List<Product> findBySellerOrderByCreatedAtDesc(User seller); //shows user s listing

    @EntityGraph(attributePaths = "images")
    Optional<Product> findByIdAndStatusNot(  //Find product by id, but ignore DELETED products.
            Long id,
            ProductStatus status
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @EntityGraph(attributePaths = "images")
    @Query("SELECT product FROM Product product WHERE product.id = :id")
    Optional<Product> findByIdForUpdate(@Param("id") Long id);
}