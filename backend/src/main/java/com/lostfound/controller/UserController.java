package com.lostfound.controller;

import com.lostfound.dto.UserResponseDTO;
import com.lostfound.mapper.UserMapper; // Import the mapper
import com.lostfound.model.User;
import com.lostfound.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors; // Import stream

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        // Convert the list of User entities to a list of UserResponseDTOs
        return userService.getAllUsers().stream()
                .map(UserMapper::toUserResponseDTO)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        // Use .map() on the optional to convert the User to UserResponseDTO
        return userService.getUserById(id)
                .map(UserMapper::toUserResponseDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        // Note: For simplicity, I'm still using the User entity as the @RequestBody
        // You could create a UserUpdateRequestDTO for even better separation
        Optional<User> existingUser = userService.getUserById(id);
        if (existingUser.isEmpty()) return ResponseEntity.notFound().build();

        User user = existingUser.get();
        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        User savedUser = userService.updateUser(user);
        // Return the secure DTO
        return ResponseEntity.ok(UserMapper.toUserResponseDTO(savedUser));
    }

    // ... (deleteUser and makeUserAdmin remain unchanged) ...
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/make-admin")
    public ResponseEntity<String> makeUserAdmin(@PathVariable Long id) {
        userService.makeUserAdmin(id);
        return ResponseEntity.ok("User is now an admin.");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}