package com.lostfound.mapper;

import com.lostfound.dto.ItemResponseDTO;
import com.lostfound.model.Item;

public class ItemMapper {

    public static ItemResponseDTO toItemResponseDTO(Item item) {
        return new ItemResponseDTO(
                item.getId(),
                item.getTitle(),
                item.getDescription(),
                item.getLocation(),
                item.getType(),
                item.getDateOccurred(),
                item.getContactInfo(),
                item.getStatus(),
                item.getCreatedAt(),
                item.getImageUrl(),
                item.getCategory(),
                // Here we re-use the UserMapper to embed the creator's info securely
                UserMapper.toUserResponseDTO(item.getCreatedBy())
        );
    }
}