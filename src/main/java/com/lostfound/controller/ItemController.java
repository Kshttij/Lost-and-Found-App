package com.lostfound.controller;

import com.lostfound.model.Item;
import com.lostfound.model.User;
import com.lostfound.service.ItemService;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService){
        this.itemService = itemService;
    }

    // ✅ Get all items (with optional filters)
    // Example calls:
    // GET /api/items                        → all items
    // GET /api/items?type=LOST              → only lost items
    // GET /api/items?status=OPEN            → only open items
    // GET /api/items?type=FOUND&status=CLOSED → both filters
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping
    public List<Item> getAllItems(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status
    ) {
        if (type != null && status != null) {
            return itemService.getItemsByTypeAndStatus(type.toUpperCase(), status.toUpperCase());
        } else if (type != null) {
            return itemService.getItemsByType(type.toUpperCase());
        } else if (status != null) {
            return itemService.getItemsByStatus(status.toUpperCase());
        } else {
            return itemService.getAllItems();
        }
    }

    // ✅ Get item by ID
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Long id) {

        Item item = itemService.getItemById(id);

        if(item != null){
            return new ResponseEntity<>(item, HttpStatus.OK);
        }
        
        else 
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // ✅ Add new item
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping
    public ResponseEntity<Item> addItem(@RequestBody Item item,
                                        Authentication authentication) {

        User loggedInUser = (User) authentication.getPrincipal();
        item.setCreatedBy(loggedInUser);

        Item savedItem = itemService.saveItem(item);
        return ResponseEntity.ok(savedItem);
    }

    // ✅ Update existing item (only ADMIN or owner)
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable Long id,
                                           @RequestBody Item updatedItem,
                                           Authentication authentication) {

        Item existingItem = itemService.getItemById(id);
        if (existingItem == null) return ResponseEntity.notFound().build();
        
        User loggedInUser = (User) authentication.getPrincipal();

        if (!loggedInUser.getRole().equals("ADMIN") &&
            !existingItem.getCreatedBy().getId().equals(loggedInUser.getId())) {
            return ResponseEntity.status(403).build();
        }

        updatedItem.setId(id);
        updatedItem.setCreatedBy(existingItem.getCreatedBy());

        Item savedItem = itemService.updateItem(updatedItem);
        return ResponseEntity.ok(savedItem);
    }

    // ✅ Delete item (only ADMIN or owner)
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id,
                                           Authentication authentication) {
        Item existingItem = itemService.getItemById(id);
        if (existingItem == null) return ResponseEntity.notFound().build();

        User loggedInUser = (User) authentication.getPrincipal();

        if (!loggedInUser.getRole().equals("ADMIN") &&
            !existingItem.getCreatedBy().getId().equals(loggedInUser.getId())) {
            return ResponseEntity.status(403).build();
        }

        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Get all items created by the logged-in user
@PreAuthorize("hasAnyRole('USER','ADMIN')")
@GetMapping("/my-items")
public ResponseEntity<List<Item>> getMyItems(Authentication authentication) {
    User loggedInUser = (User) authentication.getPrincipal();
    List<Item> myItems = itemService.getItemsByUserId(loggedInUser.getId());
    return ResponseEntity.ok(myItems);
}

@PreAuthorize("hasAnyRole('USER','ADMIN')")
@PutMapping("/{id}/resolve")
public ResponseEntity<Item> markItemAsResolved(@PathVariable Long id, Authentication authentication) {
    User loggedInUser = (User) authentication.getPrincipal();
    Item updatedItem = itemService.markItemAsResolved(id, loggedInUser.getId());
    return ResponseEntity.ok(updatedItem);
} 
}
