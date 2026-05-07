package com.skillstorm.investment_deal_room_backend.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.skillstorm.investment_deal_room_backend.models.DealActivity;

@Repository
public interface DealActivityRepository extends MongoRepository<DealActivity, String> {
    List<DealActivity> findByDealId(String dealId);

}
