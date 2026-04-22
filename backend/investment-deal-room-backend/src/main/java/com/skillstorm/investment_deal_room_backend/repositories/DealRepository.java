package com.skillstorm.investment_deal_room_backend.repositories;

import org.springframework.stereotype.Repository;
import com.skillstorm.investment_deal_room_backend.models.Deal;
import org.springframework.data.mongodb.repository.MongoRepository;

@Repository
public interface DealRepository extends MongoRepository<Deal, String> {
    
}
