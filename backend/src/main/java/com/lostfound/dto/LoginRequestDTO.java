package com.lostfound.dto;

// This class is a clean way to represent the JSON data for a login request.
public class LoginRequestDTO {
    private String email;
    private String password;

    // Getters and Setters are needed for Spring to map the JSON
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}