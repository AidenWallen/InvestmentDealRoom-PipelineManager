package com.skillstorm.investment_deal_room_backend.repositories;

import org.springframework.stereotype.Repository;
import com.skillstorm.investment_deal_room_backend.models.Deal;

import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

@Repository
public interface DealRepository extends MongoRepository<Deal, String> {

    // Custom query methods, all should filter out deleted deals
    Optional<Deal> findByIdAndDeletedFalse(String id);

    List<Deal> findByDeletedFalse();

    List<Deal> findByAssignedManagerIdAndDeletedFalse(String managerId);
}
