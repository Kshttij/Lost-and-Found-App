package com.lostfound.repository;
import java.util.Optional; 

import com.lostfound.model.User;
import org.springframework.data.jpa.repository.JpaRepository;



public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
  
}
