package com.lostfound.dto;

public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private boolean isAdmin;

    public UserResponseDTO(Long id, String name, String email, boolean isAdmin) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.isAdmin = isAdmin;
    }
    
    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public boolean isAdmin() { return isAdmin; }
}