package com.lostfound.controller;

import com.lostfound.dto.UserResponseDTO;
import com.lostfound.mapper.UserMapper;
import com.lostfound.model.User;
import com.lostfound.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    // get all users 
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        
        List<User> users = userService.getAllUsers();

        List<UserResponseDTO> responseList = new ArrayList<>();

        for (User user : users) {
            UserResponseDTO dto = UserMapper.toUserResponseDTO(user);
            responseList.add(dto);
        }

        return responseList;
    }
    // get user by id
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
    
        Optional<User> userOptional = userService.getUserById(id);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
          
            UserResponseDTO dto = UserMapper.toUserResponseDTO(user);
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //update user 

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> existingUserOptional = userService.getUserById(id);
        
        // Simple check
        if (existingUserOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = existingUserOptional.get();
        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        User savedUser = userService.updateUser(user);
        
        return ResponseEntity.ok(UserMapper.toUserResponseDTO(savedUser));
    }

    //make someone an admin

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/make-admin")
    public ResponseEntity<String> makeUserAdmin(@PathVariable Long id) {
        userService.makeUserAdmin(id);
        return ResponseEntity.ok("User is now an admin.");
    }
// delete user
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}