package com.lostfound.service;

import com.lostfound.dto.RegisterRequestDTO;
import com.lostfound.model.User;
import com.lostfound.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    
    public void makeUserAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setAdmin(true);
        userRepository.save(user);
    }


    public User saveUser(User user) {
        return userRepository.save(user);
    }
     
    // for signup
    public User registerUser(User user) throws RuntimeException {
        //  Check if email exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        //  Encode the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Set default role
        user.setAdmin(false);

        // Save to repository
        return userRepository.save(user);
    }
     
    // for login
    public User authenticate(String email, String rawPassword) throws RuntimeException {
        // Find the user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        //  Check the password
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        //  If both pass, return the User object
        return user;
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get a user by ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Get a user by email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Update user details
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    // Delete a user by ID
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // Check if email already exists (for registration)
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}