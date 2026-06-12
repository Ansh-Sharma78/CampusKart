package com.campuskart.api.product.repository;

import com.campuskart.api.auth.domain.User;
import com.campuskart.api.product.domain.Product;
import com.campuskart.api.product.domain.ProductCategory;
import com.campuskart.api.product.domain.ProductStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByStatusOrderByCreatedAtDesc(ProductStatus status);  //Show all ACTIVE products newest first.

    List<Product> findByCategoryAndStatusOrderByCreatedAtDesc(ProductCategory category, ProductStatus status);  //Show active products in BOOKS category.

    List<Product> findBySellerOrderByCreatedAtDesc(User seller);  //Seller dashboard: show my listings.

    Optional<Product> findByIdAndStatusNot(Long id, ProductStatus status); //Find product by id, but ignore DELETED products.
}