package com.lostfound.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Basic details
    private String title;
    private String description;
    private String location;
    private String type;  // LOST or FOUND
    private LocalDateTime dateOccurred;
    private String contactInfo;
    private String status; // OPEN, CLOSED, etc.
    private LocalDateTime createdAt = LocalDateTime.now();

    // ✅ Instead of storing the image as bytes, store only the URL
    @Column(nullable = false)
    private String imageUrl; // e.g. https://res.cloudinary.com/.../image.jpg

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    private String category; // e.g., Electronics, Documents, Keys, Wallets

    // ------------------------------------------------------
    // ✅ Default constructor (required by JPA)
    public Item() {}

    // ✅ Parameterized constructor
    public Item(String title, String description, String location, String type,
            LocalDateTime dateOccurred, String contactInfo, String status,
            String imageUrl, String category, User createdBy) {
    this.title = title;
    this.description = description;
    this.location = location;
    this.type = type;
    this.dateOccurred = dateOccurred;
    this.contactInfo = contactInfo;
    this.status = status;
    this.imageUrl = imageUrl;
    this.category = category;
    this.createdBy = createdBy;
    this.createdAt = LocalDateTime.now();
}

    // ------------------------------------------------------
    // ✅ Getters and setters
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

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    public String getCategory() { return category; }
public void setCategory(String category) { this.category = category; }
}
