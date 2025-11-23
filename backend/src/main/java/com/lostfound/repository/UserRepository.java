package com.lostfound.repository;

import com.lostfound.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// JpaRepository provides all basic CRUD operations
// <User, Long> means the entity is User and its primary key is Long
public interface UserRepository extends JpaRepository<User, Long> {

    // Custom query method to find a user by their email
    Optional<User> findByEmail(String email);

    // Check if a user exists by email
    boolean existsByEmail(String email);
}
