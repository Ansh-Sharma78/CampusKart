package com.campuskart.api.address.repository;

import com.campuskart.api.address.domain.Address;
import com.campuskart.api.auth.domain.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByUserOrderByDefaultAddressDescCreatedAtDesc(User user);

    Optional<Address> findByIdAndUser(Long id, User user);

    Optional<Address> findByUserAndDefaultAddressTrue(User user);
}