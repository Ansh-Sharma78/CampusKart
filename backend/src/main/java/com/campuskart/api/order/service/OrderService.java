package com.campuskart.api.order.service;

import com.campuskart.api.address.domain.Address;
import com.campuskart.api.address.repository.AddressRepository;
import com.campuskart.api.auth.domain.User;
import com.campuskart.api.auth.repository.UserRepository;
import com.campuskart.api.auth.security.UserPrincipal;
import com.campuskart.api.cart.domain.Cart;
import com.campuskart.api.cart.domain.CartItem;
import com.campuskart.api.cart.repository.CartRepository;
import com.campuskart.api.common.BusinessException;
import com.campuskart.api.order.domain.Order;
import com.campuskart.api.order.domain.OrderItem;
import com.campuskart.api.order.dto.OrderResponse;
import com.campuskart.api.order.dto.PlaceOrderRequest;
import com.campuskart.api.order.repository.OrderRepository;
import com.campuskart.api.product.domain.Product;
import com.campuskart.api.product.domain.ProductImage;
import com.campuskart.api.product.domain.ProductStatus;
import com.campuskart.api.product.repository.ProductRepository;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.campuskart.api.order.domain.OrderStatus;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public OrderService(
            OrderRepository orderRepository,
            CartRepository cartRepository,
            AddressRepository addressRepository,
            UserRepository userRepository,
            ProductRepository productRepository
    ) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public OrderResponse placeOrder(
            PlaceOrderRequest request,
            UserPrincipal principal
    ) {
        User user = getCurrentUser(principal);
        Address address = getOwnedAddress(request.addressId(), user);
        Cart cart = getCart(user);

        if (cart.getItems().isEmpty()) {
            throw new BusinessException(
                    "Cannot place an order with an empty cart",
                    HttpStatus.BAD_REQUEST
            );
        }

        List<CartItem> sortedCartItems = new ArrayList<>(cart.getItems());

        sortedCartItems.sort(
                Comparator.comparing(item -> item.getProduct().getId())
        );

        List<CheckoutItem> checkoutItems = new ArrayList<>();

        for (CartItem cartItem : sortedCartItems) {
            Product product = lockAndValidateProduct(
                    cartItem.getProduct().getId(),
                    cartItem.getQuantity()
            );

            checkoutItems.add(
                    new CheckoutItem(product, cartItem.getQuantity())
            );
        }

        BigDecimal subtotal = checkoutItems.stream()
                .map(item -> item.product()
                        .getPrice()
                        .multiply(BigDecimal.valueOf(item.quantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = new Order(user, address, subtotal);

        for (CheckoutItem checkoutItem : checkoutItems) {
            Product product = checkoutItem.product();
            int quantity = checkoutItem.quantity();

            OrderItem orderItem = new OrderItem(
                    product,
                    getFirstImageUrl(product),
                    quantity
            );

            order.addItem(orderItem);
            product.reduceStock(quantity);
        }

        Order savedOrder = orderRepository.save(order);

        cart.clearItems();
        cartRepository.save(cart);

        return OrderResponse.from(savedOrder);
    }
    @Transactional(readOnly = true)
    public List<OrderResponse> listOrders(UserPrincipal principal) {
        User user = getCurrentUser(principal);

        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(OrderResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(
            Long orderId,
            UserPrincipal principal
    ) {
        User user = getCurrentUser(principal);

        Order order = orderRepository.findByIdAndUser(orderId, user)
                .orElseThrow(() -> new BusinessException(
                        "Order not found",
                        HttpStatus.NOT_FOUND
                ));

        return OrderResponse.from(order);
    }
    @Transactional
    public OrderResponse cancelOrder(
            Long orderId,
            UserPrincipal principal
    ) {
        User user = getCurrentUser(principal);

        Order order = orderRepository.findOwnedOrderForUpdate(orderId, user)
                .orElseThrow(() -> new BusinessException(
                        "Order not found",
                        HttpStatus.NOT_FOUND
                ));

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new BusinessException(
                    "Order is already cancelled",
                    HttpStatus.BAD_REQUEST
            );
        }

        if (order.getStatus() != OrderStatus.PENDING_PAYMENT) {
            throw new BusinessException(
                    "Only pending-payment orders can be cancelled",
                    HttpStatus.CONFLICT
            );
        }

        List<OrderItem> sortedOrderItems =
                new ArrayList<>(order.getItems());

        sortedOrderItems.sort(
                Comparator.comparing(item -> item.getProduct().getId())
        );

        for (OrderItem orderItem : sortedOrderItems) {
            Product product = productRepository
                    .findByIdForUpdate(orderItem.getProduct().getId())
                    .orElseThrow(() -> new BusinessException(
                            "Ordered product no longer exists",
                            HttpStatus.CONFLICT
                    ));

            product.restoreStock(orderItem.getQuantity());
        }

        order.cancel();

        return OrderResponse.from(order);
    }
    private User getCurrentUser(UserPrincipal principal) {
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new BusinessException(
                        "Authenticated user not found",
                        HttpStatus.UNAUTHORIZED
                ));
    }

    private Address getOwnedAddress(Long addressId, User user) {
        return addressRepository.findByIdAndUser(addressId, user)
                .orElseThrow(() -> new BusinessException(
                        "Delivery address not found",
                        HttpStatus.NOT_FOUND
                ));
    }

    private Cart getCart(User user) {
        return cartRepository.findByUser(user)
                .orElseThrow(() -> new BusinessException(
                        "Cart is empty",
                        HttpStatus.BAD_REQUEST
                ));
    }

    private Product lockAndValidateProduct(
            Long productId,
            int requestedQuantity
    ) {
        Product product = productRepository.findByIdForUpdate(productId)
                .orElseThrow(() -> new BusinessException(
                        "Product not found",
                        HttpStatus.NOT_FOUND
                ));

        if (product.getStatus() != ProductStatus.ACTIVE) {
            throw new BusinessException(
                    product.getTitle() + " is no longer available",
                    HttpStatus.BAD_REQUEST
            );
        }

        if (requestedQuantity > product.getQuantity()) {
            throw new BusinessException(
                    "Only " + product.getQuantity()
                            + " unit(s) of "
                            + product.getTitle()
                            + " are available",
                    HttpStatus.BAD_REQUEST
            );
        }

        return product;
    }

    private String getFirstImageUrl(Product product) {
        return product.getImages()
                .stream()
                .min(Comparator.comparingInt(ProductImage::getSortOrder))
                .map(ProductImage::getImageUrl)
                .orElse(null);
    }

    private record CheckoutItem(
            Product product,
            int quantity
    ) {
    }
}