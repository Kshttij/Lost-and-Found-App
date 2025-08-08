package com.lostfound.service;

import com.lostfound.model.Item;
import com.lostfound.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    public Item createItem(Item item) {
        return itemRepository.save(item);
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Optional<Item> getItemById(Integer id) {
        return itemRepository.findById(id);
    }

    public List<Item> getItemsByFounderId(Integer founderId) {
        return itemRepository.findByFounderId(founderId);
    }

    /**
     * KEEP THIS SIGNATURE (used by your controller)
     * - Ensures item exists
     * - Checks ownership via SecurityContext
     * - Updates allowed fields only
     */
    public Item updateItem(Item item) {
        if (item.getId() == null) {
            throw new RuntimeException("Item id must be provided for update");
        }

        Item existing = itemRepository.findById(item.getId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // ownership check
        checkOwnership(existing);

        // update allowed fields (do not overwrite founder/id)
        existing.setTitle(item.getTitle());
        existing.setDescription(item.getDescription());
        existing.setLocation(item.getLocation());
        existing.setImageUrl(item.getImageUrl());
        existing.setType(item.getType());
        existing.setRetrieved(item.isRetrieved());

        return itemRepository.save(existing);
    }

    public void deleteItem(Integer id) {
        Item existing = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        checkOwnership(existing);
        itemRepository.deleteById(id);
    }

    public List<Item> getItemsByType(String type) {
        return itemRepository.findByType(type);
    }

    public List<Item> getItemsByTypeAndRetrieved(String type, boolean isRetrieved) {
        return itemRepository.findByTypeAndIsRetrieved(type, isRetrieved);
    }

    public Item markItemAsRetrieved(int id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with ID: " + id));
        checkOwnership(item);

        if (!item.isRetrieved()) {
            item.setRetrieved(true);
            item = itemRepository.save(item);
        }

        return item;
    }

    // --- Helper Method ---
    private void checkOwnership(Item item) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthenticated request");
        }
        String currentUserEmail = auth.getName(); // set by your JwtAuthenticationFilter
        if (currentUserEmail == null || !currentUserEmail.equals(item.getFounder().getEmail())) {
            throw new RuntimeException("You are not allowed to modify this item");
        }
    }
}
