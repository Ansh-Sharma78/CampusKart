package com.campuskart.api.product.controller;

import com.campuskart.api.auth.security.UserPrincipal;
import com.campuskart.api.common.ApiResponse;
import com.campuskart.api.product.domain.ProductCategory;
import com.campuskart.api.product.dto.CreateProductRequest;
import com.campuskart.api.product.dto.ProductResponse;
import com.campuskart.api.product.dto.UpdateProductRequest;
import com.campuskart.api.product.service.ProductService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ApiResponse<List<ProductResponse>> listProducts(
            @RequestParam(required = false) ProductCategory category
    ) {
        return ApiResponse.success("Products fetched successfully", productService.listActiveProducts(category));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('SELLER')")
    public ApiResponse<List<ProductResponse>> listMyProducts(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success("Seller products fetched successfully", productService.listMyProducts(principal));
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProduct(@PathVariable Long id) {
        return ApiResponse.success("Product fetched successfully", productService.getProduct(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('SELLER')")
    public ApiResponse<ProductResponse> createProduct(
            @Valid @RequestBody CreateProductRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success("Product created successfully", productService.createProduct(request, principal));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SELLER')")
    public ApiResponse<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProductRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success("Product updated successfully", productService.updateProduct(id, request, principal));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SELLER')")
    public ApiResponse<Map<String, Boolean>> deleteProduct(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        productService.deleteProduct(id, principal);
        return ApiResponse.success("Product deleted successfully", Map.of("deleted", true));
    }

    @PostMapping("/{id}/images")
    @PreAuthorize("hasRole('SELLER')")
    public ApiResponse<ProductResponse> uploadProductImage(
            @PathVariable Long id,
            @RequestPart("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success(
                "Product image uploaded successfully",
                productService.uploadProductImage(id, file, principal)
        );
    }
}