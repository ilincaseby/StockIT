package com.stockit.repositories;

import com.stockit.classes.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {
    Boolean existsByWebsite(String websiteName);
    Optional<Shop> findByWebsite(String websiteName);
}
