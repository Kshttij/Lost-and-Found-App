package com.lostfound.dto;

import java.time.LocalDateTime;

public class ItemResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String type;
    private LocalDateTime dateOccurred;
    private String contactInfo;
    private String status;
    private LocalDateTime createdAt;
    private String imageUrl;
    private String category;
    
    
    private UserResponseDTO createdBy; 

    public ItemResponseDTO(Long id, String title, String description, String location, 
                           String type, LocalDateTime dateOccurred, String contactInfo, 
                           String status, LocalDateTime createdAt, String imageUrl, 
                           String category, UserResponseDTO createdBy) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.type = type;
        this.dateOccurred = dateOccurred;
        this.contactInfo = contactInfo;
        this.status = status;
        this.createdAt = createdAt;
        this.imageUrl = imageUrl;
        this.category = category;
        this.createdBy = createdBy;
    }

    // --- Getters and setters for all fields ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public LocalDateTime getDateOccurred() { return dateOccurred; }
    public void setDateOccurred(LocalDateTime dateOccurred) { this.dateOccurred = dateOccurred; }

    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public UserResponseDTO getCreatedBy() { return createdBy; }
    public void setCreatedBy(UserResponseDTO createdBy) { this.createdBy = createdBy; }
}