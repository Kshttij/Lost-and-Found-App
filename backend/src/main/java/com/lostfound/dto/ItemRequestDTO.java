package com.lostfound.dto;

import java.time.LocalDateTime;

public class ItemRequestDTO {
    private String title;
    private String description;
    private String location;
    private String type; // LOST or FOUND
    private LocalDateTime dateOccurred;
    private String contactInfo;
    private String status; // OPEN, CLOSED
    private String imageUrl;
    private String category;

    

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

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}