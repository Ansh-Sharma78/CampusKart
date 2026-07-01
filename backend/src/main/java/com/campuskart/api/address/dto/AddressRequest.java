package com.campuskart.api.address.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AddressRequest(
        @NotBlank(message = "Recipient name is required")
        @Size(max = 120, message = "Recipient name must be at most 120 characters")
        String recipientName,

        @NotBlank(message = "Phone number is required")
        @Size(max = 20, message = "Phone number must be at most 20 characters")
        String phoneNumber,

        @NotBlank(message = "Address line 1 is required")
        @Size(max = 180, message = "Address line 1 must be at most 180 characters")
        String line1,

        @Size(max = 180, message = "Address line 2 must be at most 180 characters")
        String line2,

        @NotBlank(message = "City is required")
        @Size(max = 100, message = "City must be at most 100 characters")
        String city,

        @NotBlank(message = "State is required")
        @Size(max = 100, message = "State must be at most 100 characters")
        String state,

        @NotBlank(message = "Postal code is required")
        @Size(max = 20, message = "Postal code must be at most 20 characters")
        String postalCode,

        @NotBlank(message = "Campus is required")
        @Size(max = 120, message = "Campus must be at most 120 characters")
        String campus,

        boolean defaultAddress
) {
}