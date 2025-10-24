package com.lostfound.controller;

import com.lostfound.config.JwtUtil;
import com.lostfound.model.User;
import com.lostfound.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String rawPassword = loginData.get("password");

        Optional<User> userOptional = userService.getUserByEmail(email);
        if (userOptional.isEmpty()) return ResponseEntity.status(401).body("Invalid email or password");

        User user = userOptional.get();

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        String token = jwtUtil.generateToken(email);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("email", email);
        response.put("role", user.getRole());
        response.put("id", String.valueOf(user.getId()));

        return ResponseEntity.ok(response);
    }
}
