package com.skillstorm.investment_deal_room_backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.skillstorm.investment_deal_room_backend.models.Counterparty;

@Repository
public interface CounterpartyRepository extends MongoRepository<Counterparty, String> {

}
