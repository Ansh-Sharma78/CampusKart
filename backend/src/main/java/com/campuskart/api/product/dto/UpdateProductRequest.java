package com.campuskart.api.product.dto;

import com.campuskart.api.product.domain.ProductCategory;
import com.campuskart.api.product.domain.ProductCondition;
import com.campuskart.api.product.domain.ProductStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record UpdateProductRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 140, message = "Title must be at most 140 characters")
        String title,

        @NotBlank(message = "Description is required")
        @Size(max = 5000, message = "Description must be at most 5000 characters")
        String description,

        @NotNull(message = "Category is required")
        ProductCategory category,

        @NotNull(message = "Condition is required")
        ProductCondition condition,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.01", message = "Price must be greater than zero")
        BigDecimal price,

        @NotBlank(message = "Campus is required")
        @Size(max = 120, message = "Campus must be at most 120 characters")
        String campus,

        @Min(value = 0, message = "Quantity cannot be negative")
        int quantity,

        @NotNull(message = "Status is required")
        ProductStatus status
) {
}