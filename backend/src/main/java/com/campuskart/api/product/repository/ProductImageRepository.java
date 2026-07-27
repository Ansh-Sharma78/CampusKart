package com.campuskart.api.product.repository;

import com.campuskart.api.product.domain.Product;
import com.campuskart.api.product.domain.ProductImage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

    List<ProductImage> findByProductOrderBySortOrderAsc(Product product);  //Load product images in display order.
}

