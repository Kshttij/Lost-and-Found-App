package com.lostfound.service;

import com.lostfound.model.Item;
import com.lostfound.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    // ✅ Save new item (no image upload logic now)
    public Item saveItem(Item item) {
        return itemRepository.save(item);
    }

    // ✅ Update existing item
    public Item updateItem(Item item) {
        return itemRepository.save(item);
    }

    // ✅ Get all items
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    // ✅ Get item by ID
    public Optional<Item> getItemById(Long id) {
        return itemRepository.findById(id);
    }

    // ✅ Delete item
    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }

    // ✅ Get items by type (LOST or FOUND)
    public List<Item> getItemsByType(String type) {
        return itemRepository.findByType(type);
    }

    // ✅ Get items by status (OPEN, CLAIMED, RETURNED)
    public List<Item> getItemsByStatus(String status) {
        return itemRepository.findByStatus(status);
    }

    // ✅ Get items by user
    public List<Item> getItemsByUserId(Long userId) {
        return itemRepository.findByCreatedById(userId);
    }

    public List<Item> getItemsByTypeAndStatus(String type, String status) {
        return itemRepository.findByTypeAndStatus(type, status);
    }

    public Item markItemAsResolved(Long itemId, Long userId) {
    Optional<Item> optionalItem = itemRepository.findById(itemId);
    if (!optionalItem.isPresent()) {
        throw new RuntimeException("Item not found");
    }

    Item item = optionalItem.get();

    // ensure only the owner or admin can mark it resolved
    if (!item.getCreatedBy().getId().equals(userId)) {
        throw new RuntimeException("Unauthorized: You can only resolve your own items");
    }

    item.setStatus("Resolved");
    return itemRepository.save(item);
}

}
