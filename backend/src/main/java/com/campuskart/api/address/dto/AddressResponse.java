package com.campuskart.api.address.dto;

import com.campuskart.api.address.domain.Address;
import java.time.Instant;

public record AddressResponse(
        Long id,
        String recipientName,
        String phoneNumber,
        String line1,
        String line2,
        String city,
        String state,
        String postalCode,
        String campus,
        boolean defaultAddress,
        Instant createdAt,
        Instant updatedAt
) {

    public static AddressResponse from(Address address) {
        return new AddressResponse(
                address.getId(),
                address.getRecipientName(),
                address.getPhoneNumber(),
                address.getLine1(),
                address.getLine2(),
                address.getCity(),
                address.getState(),
                address.getPostalCode(),
                address.getCampus(),
                address.isDefaultAddress(),
                address.getCreatedAt(),
                address.getUpdatedAt()
        );
    }
}