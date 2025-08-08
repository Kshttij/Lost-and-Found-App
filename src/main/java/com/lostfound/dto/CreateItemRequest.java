package com.lostfound.dto;

public class CreateItemRequest {
    public String title;
    public String description;
    public String imageUrl;
    public String location;
    public String type; // "lost" or "found"
    public int founderId;
}

