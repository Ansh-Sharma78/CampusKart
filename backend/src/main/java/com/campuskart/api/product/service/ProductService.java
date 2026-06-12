package com.campuskart.api.product.service;

import com.campuskart.api.auth.domain.User;
import com.campuskart.api.auth.domain.UserRole;
import com.campuskart.api.auth.repository.UserRepository;
import com.campuskart.api.auth.security.UserPrincipal;
import com.campuskart.api.common.BusinessException;
import com.campuskart.api.product.domain.Product;
import com.campuskart.api.product.domain.ProductCategory;
import com.campuskart.api.product.domain.ProductStatus;
import com.campuskart.api.product.dto.CreateProductRequest;
import com.campuskart.api.product.dto.ProductResponse;
import com.campuskart.api.product.dto.UpdateProductRequest;
import com.campuskart.api.product.repository.ProductRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.campuskart.api.product.domain.ProductImage;
import com.campuskart.api.storage.StorageService;
import com.campuskart.api.storage.StoredFile;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    public ProductService(ProductRepository productRepository, UserRepository userRepository, StorageService storageService) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.storageService = storageService;
    }

    @Transactional
    public ProductResponse uploadProductImage(
            Long productId,
            MultipartFile file,
            UserPrincipal principal
    ) {
        Product product = findOwnedProduct(productId, principal);

        if (product.getImages().size() >= 5) {
            throw new BusinessException(
                    "A product can have a maximum of 5 images",
                    HttpStatus.BAD_REQUEST
            );
        }

        StoredFile storedFile = storageService.storeProductImage(file);

        ProductImage productImage = new ProductImage(
                storedFile.url(),
                storedFile.fileName(),
                storedFile.contentType(),
                product.getImages().size()
        );

        product.addImage(productImage);

        return ProductResponse.from(product);
    }
    @Transactional(readOnly = true)  //lists active products
    public List<ProductResponse> listActiveProducts(ProductCategory category) {
        List<Product> products = category == null
                ? productRepository.findByStatusOrderByCreatedAtDesc(ProductStatus.ACTIVE)
                : productRepository.findByCategoryAndStatusOrderByCreatedAtDesc(category, ProductStatus.ACTIVE);

        return products.stream()
                .map(ProductResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)  //Finds product if it is not deleted.
    public ProductResponse getProduct(Long id) {
        Product product = findVisibleProduct(id);
        return ProductResponse.from(product);
    }

    @Transactional(readOnly = true) //Lists products created by currently logged-in seller.
    public List<ProductResponse> listMyProducts(UserPrincipal principal) {
        User seller = currentSeller(principal);

        return productRepository.findBySellerOrderByCreatedAtDesc(seller)
                .stream()
                .map(ProductResponse::from)
                .toList();
    }

    @Transactional //Creates a product listing.
    public ProductResponse createProduct(CreateProductRequest request, UserPrincipal principal) {
        User seller = currentSeller(principal);

        Product product = new Product(
                seller,
                request.title().trim(),
                request.description().trim(),
                request.category(),
                request.condition(),
                request.price(),
                request.campus().trim(),
                request.quantity()
        );

        Product savedProduct = productRepository.save(product);
        return ProductResponse.from(savedProduct);
    }

    @Transactional //Updates an existing product.
    public ProductResponse updateProduct(Long id, UpdateProductRequest request, UserPrincipal principal) {
        Product product = findOwnedProduct(id, principal);

        product.updateDetails(
                request.title().trim(),
                request.description().trim(),
                request.category(),
                request.condition(),
                request.price(),
                request.campus().trim(),
                request.quantity(),
                request.status()
        );

        return ProductResponse.from(product);
    }

    @Transactional //Deletes product.
    public void deleteProduct(Long id, UserPrincipal principal) {
        Product product = findOwnedProduct(id, principal);
        product.markDeleted();
    }

    private Product findVisibleProduct(Long id) { //helper methods
        return productRepository.findByIdAndStatusNot(id, ProductStatus.DELETED)
                .orElseThrow(() -> new BusinessException("Product not found", HttpStatus.NOT_FOUND));
    }



    //Finds product and checks owner.
    private Product findOwnedProduct(Long id, UserPrincipal principal) {
        Product product = findVisibleProduct(id);

        if (!product.getSeller().getId().equals(principal.getId())) {
            throw new BusinessException("You can manage only your own listings", HttpStatus.FORBIDDEN);
        }

        return product;
    }

    private User currentSeller(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new BusinessException("Authenticated user not found", HttpStatus.UNAUTHORIZED));

        if (user.getRole() != UserRole.SELLER) {
            throw new BusinessException("Seller role is required", HttpStatus.FORBIDDEN);
        }

        return user;
    }
}