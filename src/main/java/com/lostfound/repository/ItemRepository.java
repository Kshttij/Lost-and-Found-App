package com.lostfound.repository;

import com.lostfound.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Integer> {
    List<Item> findByIsRetrievedFalse(); // For showing only active (unclaimed) items
    List<Item> findByFounderId(Integer founderId); // For filtering items by user
    List<Item> findByType(String type);
    List<Item> findByTypeAndIsRetrieved(String type, boolean isRetrieved);

}
