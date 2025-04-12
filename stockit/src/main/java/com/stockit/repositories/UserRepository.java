package com.stockit.repositories;

import com.stockit.classes.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUid(String uid);
    Boolean existsByUsernameOrEmail(String username, String email);
}
