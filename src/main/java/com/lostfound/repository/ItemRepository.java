package com.lostfound.repository;

import com.lostfound.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByType(String type); // LOST / FOUND

    List<Item> findByCreatedById(Long userId); // OPEN / CLOSED

    List<Item> findByStatus(String status);

    List<Item> findByTypeAndStatus(String type, String status);  // combined filter
}
