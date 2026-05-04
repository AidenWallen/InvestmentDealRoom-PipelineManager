package com.skillstorm.investment_deal_room_backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.skillstorm.investment_deal_room_backend.models.Counterparty;

@Repository
public interface CounterpartyRepository extends MongoRepository<Counterparty, String> {

    List<Counterparty> findByDeletedFalse();

    Optional<Counterparty> findByIdAndDeletedFalse(String id);

}
