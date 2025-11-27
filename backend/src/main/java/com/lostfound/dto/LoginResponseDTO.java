package com.lostfound.dto;


public class LoginResponseDTO {
    private String token;
    private String email;
    private String role;
    private Long id;

    public LoginResponseDTO(String token, String email, String role, Long id) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.id = id;
    }

    // Getters
    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public Long getId() { return id; }
}