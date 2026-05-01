package com.skillstorm.investment_deal_room_backend.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.skillstorm.investment_deal_room_backend.models.DealCounterparty;

@Repository
public interface DealCounterpartyRepository extends MongoRepository<DealCounterparty, String>{

    List<DealCounterparty> findByDealId(String string);

    List<DealCounterparty> findByCounterpartyId(String string);

}
