package com.skillstorm.investment_deal_room_backend.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.skillstorm.investment_deal_room_backend.enums.DealRole;
import com.skillstorm.investment_deal_room_backend.models.DealCounterparty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Repository
public interface DealCounterpartyRepository extends MongoRepository<DealCounterparty, String>{

    List<DealCounterparty> findByDealId(String dealId);

    List<DealCounterparty> findByCounterpartyId(String counterpartyId);

    Boolean existsByDealIdAndCounterpartyId(String dealId, String counterpartyId);

    Object findByDealIdAndCounterpartyIdAndDeletedFalse(String dealId, String counterpartyId);

}
