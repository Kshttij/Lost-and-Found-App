package com.lostfound.controller;

import com.lostfound.dto.LoginRequest;
import com.lostfound.dto.SignupRequest;
import com.lostfound.model.User;
import com.lostfound.repository.UserRepository;
import com.lostfound.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // Signup
@PostMapping("/signup")
public ResponseEntity<?> signupUser(@RequestBody SignupRequest signupRequest) {
    User user = new User();
    user.setEmail(signupRequest.getEmail());
    user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
    user.setName(signupRequest.getName());
    userRepository.save(user);
    return ResponseEntity.ok("User registered successfully");
}

// Login
@PostMapping("/login")
public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
    var userOpt = userRepository.findByEmail(request.getEmail());
    if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
    User user = userOpt.get();
    String token = jwtUtil.generateToken(user.getEmail());
    return ResponseEntity.ok(Collections.singletonMap("token", token));
}

}
