package com.lostfound.model;

import jakarta.persistence.*;

// The @Entity annotation tells Spring Boot that this class represents a table in the database
@Entity
@Table(name = "users")  // optional, but sets the table name
public class User {

    // @Id marks the primary key column
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-increment id
    private Long id;

    // Columns in the 'users' table
    private String name;

    @Column(unique = true)  // email must be unique
    private String email;

    private String password;
    private String role;  // e.g., "USER" or "ADMIN"

    // Default constructor required by JPA
    public User() {
    }

    // Constructor for easier object creation
    public User(String name, String email, String password, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // Getters and Setters (used by JPA to read/write data)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}

