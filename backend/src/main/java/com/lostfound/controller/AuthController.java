package com.lostfound.controller;

import com.lostfound.config.JwtUtil;
import com.lostfound.dto.LoginRequestDTO;
import com.lostfound.dto.LoginResponseDTO;
import com.lostfound.dto.RegisterRequestDTO;
import com.lostfound.model.User;
import com.lostfound.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
   

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            // authentication done by service
            User user = userService.authenticate(
                loginRequest.getEmail(), 
                loginRequest.getPassword()
            );

            // Create JWT
            String token = jwtUtil.generateToken(user.getEmail());
            String role = user.isAdmin() ? "ADMIN" : "USER";

            // Create Response DTO
            LoginResponseDTO response = new LoginResponseDTO(
                token, 
                user.getEmail(), 
                role, 
                user.getId()
            );
            
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            // authentication failure
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

   @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequestDTO registerRequest) {
        try {
            
            User newUser = new User();
            newUser.setName(registerRequest.getName());
            newUser.setEmail(registerRequest.getEmail());
            newUser.setPassword(registerRequest.getPassword()); 
            
            
            // The service will handle all logic like checking if it exists, giving admin control etc
            userService.registerUser(newUser);

            return ResponseEntity.ok("User registered successfully");

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}