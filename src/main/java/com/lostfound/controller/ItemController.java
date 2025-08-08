package com.lostfound.controller;
import com.lostfound.repository.*;
import com.lostfound.dto.CreateItemRequest;
import com.lostfound.model.Item;
import com.lostfound.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.lostfound.model.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("")
    public Item createItem(@RequestBody CreateItemRequest request) {
        Item item = new Item();
        item.setTitle(request.title);
        item.setDescription(request.description);
        item.setImageUrl(request.imageUrl);
        item.setLocation(request.location);
        item.setType(request.type);
        item.setCreatedAt(LocalDateTime.now());
        item.setRetrieved(false);

        User founder = userRepository.findById(request.founderId)
                .orElseThrow(() -> new RuntimeException("Founder user not found with id: " + request.founderId));

        item.setFounder(founder);

        return itemService.createItem(item);
    }

    @GetMapping
    public List<Item> getItems(
    @RequestParam(required = false) String type,
    @RequestParam(required = false) Boolean retrieved
) {
    if (type != null && retrieved != null && type.equals("found")) {
        return itemService.getItemsByTypeAndRetrieved(type, retrieved);
    } else if (type != null) {
        return itemService.getItemsByType(type);
    }
    return itemService.getAllItems();
}

    @GetMapping("/active")
    public List<Item> getActiveItems() {
        return itemService.getAllItems()
                .stream()
                .filter(i -> !i.isRetrieved())
                .toList();
    }

    @GetMapping("/{id}")
    public Optional<Item> getItemById(@PathVariable Integer id) {
        return itemService.getItemById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Item> getItemsByFounder(@PathVariable Integer userId) {
        return itemService.getItemsByFounderId(userId);
    }

    @PutMapping("/{id}")
    public Item updateItem(@PathVariable Integer id, @RequestBody Item item) {
        item.setId(id);
        return itemService.updateItem(item);
    }

    @DeleteMapping("/{id}")
public String deleteItem(@PathVariable int id) {
    itemService.deleteItem(id);
    return "Item with ID " + id + " has been deleted.";
}

//for setting retrieved
@PutMapping("/{id}/retrieved")
public ResponseEntity<Item> markAsRetrieved(@PathVariable int id) {
    try {
        Item updatedItem = itemService.markItemAsRetrieved(id);
        return ResponseEntity.ok(updatedItem);
    } catch (RuntimeException e) {
        return ResponseEntity.notFound().build();
    }
}

}
