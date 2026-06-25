package com.campuskart.api.cart.service;

import com.campuskart.api.auth.domain.User;
import com.campuskart.api.auth.repository.UserRepository;
import com.campuskart.api.auth.security.UserPrincipal;
import com.campuskart.api.cart.domain.Cart;
import com.campuskart.api.cart.domain.CartItem;
import com.campuskart.api.cart.dto.AddCartItemRequest;
import com.campuskart.api.cart.dto.CartResponse;
import com.campuskart.api.cart.dto.UpdateCartItemRequest;
import com.campuskart.api.cart.repository.CartItemRepository;
import com.campuskart.api.cart.repository.CartRepository;
import com.campuskart.api.common.BusinessException;
import com.campuskart.api.product.domain.Product;
import com.campuskart.api.product.domain.ProductStatus;
import com.campuskart.api.product.repository.ProductRepository;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            UserRepository userRepository,
            ProductRepository productRepository
    ) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public CartResponse getCart(UserPrincipal principal) {
        User user = getCurrentUser(principal);
        Cart cart = getOrCreateCart(user);

        return CartResponse.from(cart);
    }

    @Transactional
    public CartResponse addItem(AddCartItemRequest request, UserPrincipal principal) {
        User user = getCurrentUser(principal);
        Cart cart = getOrCreateCart(user);
        Product product = getAvailableProduct(request.productId());

        validateQuantity(product, request.quantity());

        Optional<CartItem> existingItem = cart.getItems()
                .stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + request.quantity();

            validateQuantity(product, newQuantity);
            item.updateQuantity(newQuantity);
        } else {
            CartItem item = new CartItem(product, request.quantity());
            cart.addItem(item);
        }

        Cart savedCart = cartRepository.save(cart);
        return CartResponse.from(savedCart);
    }

    @Transactional
    public CartResponse updateItem(Long itemId, UpdateCartItemRequest request, UserPrincipal principal) {
        User user = getCurrentUser(principal);
        Cart cart = getOrCreateCart(user);
        CartItem item = getCartItem(itemId, cart);

        validateQuantity(item.getProduct(), request.quantity());

        item.updateQuantity(request.quantity());

        return CartResponse.from(cart);
    }

    @Transactional
    public void removeItem(Long itemId, UserPrincipal principal) {
        User user = getCurrentUser(principal);
        Cart cart = getOrCreateCart(user);
        CartItem item = getCartItem(itemId, cart);

        cart.removeItem(item);
        cartItemRepository.delete(item);
    }

    private User getCurrentUser(UserPrincipal principal) {
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new BusinessException(
                        "Authenticated user not found",
                        HttpStatus.UNAUTHORIZED
                ));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(new Cart(user)));
    }

    private Product getAvailableProduct(Long productId) {
        Product product = productRepository.findByIdAndStatusNot(productId, ProductStatus.DELETED)
                .orElseThrow(() -> new BusinessException(
                        "Product not found",
                        HttpStatus.NOT_FOUND
                ));

        if (product.getStatus() != ProductStatus.ACTIVE) {
            throw new BusinessException(
                    "Product is not available",
                    HttpStatus.BAD_REQUEST
            );
        }

        return product;
    }

    private CartItem getCartItem(Long itemId, Cart cart) {
        return cartItemRepository.findByIdAndCart(itemId, cart)
                .orElseThrow(() -> new BusinessException(
                        "Cart item not found",
                        HttpStatus.NOT_FOUND
                ));
    }

    private void validateQuantity(Product product, int quantity) {
        if (quantity > product.getQuantity()) {
            throw new BusinessException(
                    "Requested quantity exceeds available stock",
                    HttpStatus.BAD_REQUEST
            );
        }
    }
}