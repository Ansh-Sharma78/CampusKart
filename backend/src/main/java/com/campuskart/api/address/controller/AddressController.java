package com.campuskart.api.address.controller;

import com.campuskart.api.address.dto.AddressRequest;
import com.campuskart.api.address.dto.AddressResponse;
import com.campuskart.api.address.service.AddressService;
import com.campuskart.api.auth.security.UserPrincipal;
import com.campuskart.api.common.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    public ApiResponse<List<AddressResponse>> listAddresses(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success(
                "Addresses fetched successfully",
                addressService.listAddresses(principal)
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AddressResponse> createAddress(
            @Valid @RequestBody AddressRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success(
                "Address created successfully",
                addressService.createAddress(request, principal)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<AddressResponse> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success(
                "Address updated successfully",
                addressService.updateAddress(id, request, principal)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Map<String, Boolean>> deleteAddress(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        addressService.deleteAddress(id, principal);

        return ApiResponse.success(
                "Address deleted successfully",
                Map.of("deleted", true)
        );
    }

    @PostMapping("/{id}/default")
    public ApiResponse<AddressResponse> setDefaultAddress(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success(
                "Default address updated successfully",
                addressService.setDefaultAddress(id, principal)
        );
    }
}