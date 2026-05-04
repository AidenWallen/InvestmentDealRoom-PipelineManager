package com.skillstorm.investment_deal_room_backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.skillstorm.investment_deal_room_backend.models.DealCounterparty;

@Repository
public interface DealCounterpartyRepository extends MongoRepository<DealCounterparty, String>{

    List<DealCounterparty> findByDealId(String dealId);

    List<DealCounterparty> findByCounterpartyId(String counterpartyId);

    Optional<DealCounterparty> findByDealIdAndCounterpartyIdAndDeletedFalse(String dealId, String counterpartyId);

    void deleteByDealId(String id);

}
