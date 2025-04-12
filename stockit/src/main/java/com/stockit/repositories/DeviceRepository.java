package com.stockit.repositories;

import com.stockit.classes.Category;
import com.stockit.classes.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    Boolean existsByName(String name);
    void deleteById(@NonNull Long id);
    List<Device> findAllByCategory(Category category);
    Optional<Device> findByName(String name);
}
