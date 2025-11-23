package com.lostfound.controller;

import com.lostfound.dto.ItemRequestDTO; // New import
import com.lostfound.dto.ItemResponseDTO; // New import
import com.lostfound.mapper.ItemMapper; // New import
import com.lostfound.model.Item;
import com.lostfound.model.User;
import com.lostfound.service.ItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping
    public List<ItemResponseDTO> getAllItems(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status
    ) {
        List<Item> items; // Get the entities from the service
        if (type != null && status != null) {
            items = itemService.getItemsByTypeAndStatus(type.toUpperCase(), status.toUpperCase());
        } else if (type != null) {
            items = itemService.getItemsByType(type.toUpperCase());
        } else if (status != null) {
            items = itemService.getItemsByStatus(status.toUpperCase());
        } else {
            items = itemService.getAllItems();
        }
        
        List<ItemResponseDTO> dtoList = new ArrayList<>();

        for(Item item : items){
            ItemResponseDTO dto = ItemMapper.toItemResponseDTO(item);
            dtoList.add(dto);
        }
        return dtoList;
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ItemResponseDTO> getItemById(@PathVariable Long id) {
        Item item = itemService.getItemById(id);
        if (item != null) {
            // Map entity to DTO
            return new ResponseEntity<>(ItemMapper.toItemResponseDTO(item), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping
    public ResponseEntity<ItemResponseDTO> addItem(@RequestBody ItemRequestDTO itemRequest,
                                                 Authentication authentication) {
        User loggedInUser = (User) authentication.getPrincipal();

        // --- Map DTO to Entity ---
        Item newItem = new Item();
        newItem.setTitle(itemRequest.getTitle());
        newItem.setDescription(itemRequest.getDescription());
        newItem.setLocation(itemRequest.getLocation());
        newItem.setType(itemRequest.getType());
        newItem.setDateOccurred(itemRequest.getDateOccurred());
        newItem.setContactInfo(itemRequest.getContactInfo());
        newItem.setStatus(itemRequest.getStatus());
        newItem.setImageUrl(itemRequest.getImageUrl());
        newItem.setCategory(itemRequest.getCategory());
        
        // Set server-controlled fields
        newItem.setCreatedBy(loggedInUser);
        // Note: 'createdAt' is already handled in your Item entity constructor/default

        Item savedItem = itemService.saveItem(newItem);
        
        // Map saved entity to response DTO
        return ResponseEntity.ok(ItemMapper.toItemResponseDTO(savedItem));
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ItemResponseDTO> updateItem(@PathVariable Long id,
                                                      @RequestBody ItemRequestDTO itemRequest,
                                                      Authentication authentication) {
        Item existingItem = itemService.getItemById(id);
        if (existingItem == null) return ResponseEntity.notFound().build();

        User loggedInUser = (User) authentication.getPrincipal();

        if (!loggedInUser.isAdmin() &&
                !existingItem.getCreatedBy().getId().equals(loggedInUser.getId())) {
            return ResponseEntity.status(403).build();
        }

        // --- Map DTO to Entity for update ---
        existingItem.setTitle(itemRequest.getTitle());
        existingItem.setDescription(itemRequest.getDescription());
        existingItem.setLocation(itemRequest.getLocation());
        existingItem.setType(itemRequest.getType());
        existingItem.setDateOccurred(itemRequest.getDateOccurred());
        existingItem.setContactInfo(itemRequest.getContactInfo());
        existingItem.setStatus(itemRequest.getStatus());
        existingItem.setImageUrl(itemRequest.getImageUrl());
        existingItem.setCategory(itemRequest.getCategory());
        // We don't change 'id' or 'createdBy'

        Item savedItem = itemService.updateItem(existingItem);
        return ResponseEntity.ok(ItemMapper.toItemResponseDTO(savedItem));
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id,
                                           Authentication authentication) {
        
        Item existingItem = itemService.getItemById(id);
        if (existingItem == null) return ResponseEntity.notFound().build();
        User loggedInUser = (User) authentication.getPrincipal();
        if (!loggedInUser.isAdmin() &&
                !existingItem.getCreatedBy().getId().equals(loggedInUser.getId())) {
            return ResponseEntity.status(403).build();
        }
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/my-items")
    public ResponseEntity<List<ItemResponseDTO>> getMyItems(Authentication authentication) {
        User loggedInUser = (User) authentication.getPrincipal();
        List<Item> myItems = itemService.getItemsByUserId(loggedInUser.getId());
        
        // Map to DTOs
        List<ItemResponseDTO> myItemsDTO = new ArrayList<>();

        for(Item item : myItems){
             ItemResponseDTO dto = ItemMapper.toItemResponseDTO(item);
             myItemsDTO.add(dto); 
        }
                
        return ResponseEntity.ok(myItemsDTO);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/{id}/resolve")
    public ResponseEntity<ItemResponseDTO> markItemAsResolved(@PathVariable Long id, Authentication authentication) {
        User loggedInUser = (User) authentication.getPrincipal();
        Item updatedItem = itemService.markItemAsResolved(id, loggedInUser);
        
        // Map to DTO
        return ResponseEntity.ok(ItemMapper.toItemResponseDTO(updatedItem));
    }
}