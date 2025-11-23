package com.lostfound.repository;

import com.lostfound.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByType(String type); // LOST / FOUND

    List<Item> findByCreatedById(Long userId); // OPEN / CLOSED

    List<Item> findByStatus(String status);

    List<Item> findByTypeAndStatus(String type, String status);  // combined filter

List<Item> findByCategory(String category);
List<Item> findByTypeAndCategory(String type, String category);
List<Item> findByTypeAndStatusAndCategory(String type, String status, String category);

}
