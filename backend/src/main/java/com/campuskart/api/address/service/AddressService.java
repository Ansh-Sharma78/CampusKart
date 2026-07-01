package com.campuskart.api.address.service;

import com.campuskart.api.address.domain.Address;
import com.campuskart.api.address.dto.AddressRequest;
import com.campuskart.api.address.dto.AddressResponse;
import com.campuskart.api.address.repository.AddressRepository;
import com.campuskart.api.auth.domain.User;
import com.campuskart.api.auth.repository.UserRepository;
import com.campuskart.api.auth.security.UserPrincipal;
import com.campuskart.api.common.BusinessException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(
            AddressRepository addressRepository,
            UserRepository userRepository
    ) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<AddressResponse> listAddresses(UserPrincipal principal) {
        User user = getCurrentUser(principal);

        return addressRepository.findByUserOrderByDefaultAddressDescCreatedAtDesc(user)
                .stream()
                .map(AddressResponse::from)
                .toList();
    }

    @Transactional
    public AddressResponse createAddress(AddressRequest request, UserPrincipal principal) {
        User user = getCurrentUser(principal);

        boolean shouldBeDefault = request.defaultAddress()
                || addressRepository.findByUserAndDefaultAddressTrue(user).isEmpty();

        if (shouldBeDefault) {
            clearCurrentDefault(user);
        }

        Address address = new Address(
                user,
                request.recipientName().trim(),
                request.phoneNumber().trim(),
                request.line1().trim(),
                trimNullable(request.line2()),
                request.city().trim(),
                request.state().trim(),
                request.postalCode().trim(),
                request.campus().trim(),
                shouldBeDefault
        );

        Address savedAddress = addressRepository.save(address);
        return AddressResponse.from(savedAddress);
    }

    @Transactional
    public AddressResponse updateAddress(Long id, AddressRequest request, UserPrincipal principal) {
        User user = getCurrentUser(principal);
        Address address = getOwnedAddress(id, user);

        if (request.defaultAddress()) {
            clearCurrentDefault(user);
            address.markDefault();
        }

        address.updateDetails(
                request.recipientName().trim(),
                request.phoneNumber().trim(),
                request.line1().trim(),
                trimNullable(request.line2()),
                request.city().trim(),
                request.state().trim(),
                request.postalCode().trim(),
                request.campus().trim()
        );

        return AddressResponse.from(address);
    }

    @Transactional
    public void deleteAddress(Long id, UserPrincipal principal) {
        User user = getCurrentUser(principal);
        Address address = getOwnedAddress(id, user);

        addressRepository.delete(address);
    }

    @Transactional
    public AddressResponse setDefaultAddress(Long id, UserPrincipal principal) {
        User user = getCurrentUser(principal);
        Address address = getOwnedAddress(id, user);

        clearCurrentDefault(user);
        address.markDefault();

        return AddressResponse.from(address);
    }

    private User getCurrentUser(UserPrincipal principal) {
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new BusinessException(
                        "Authenticated user not found",
                        HttpStatus.UNAUTHORIZED
                ));
    }

    private Address getOwnedAddress(Long id, User user) {
        return addressRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new BusinessException(
                        "Address not found",
                        HttpStatus.NOT_FOUND
                ));
    }

    private void clearCurrentDefault(User user) {
        addressRepository.findByUserAndDefaultAddressTrue(user)
                .ifPresent(Address::clearDefault);
    }

    private String trimNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}