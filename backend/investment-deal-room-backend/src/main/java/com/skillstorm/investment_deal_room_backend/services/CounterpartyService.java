package com.skillstorm.investment_deal_room_backend.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.CreateCounterpartyRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response.CounterpartyResponseDto;
import com.skillstorm.investment_deal_room_backend.models.Counterparty;
import com.skillstorm.investment_deal_room_backend.repositories.CounterpartyRepository;

@Service
public class CounterpartyService {

    private final CounterpartyRepository counterpartyRepository;

    public CounterpartyService(CounterpartyRepository counterpartyRepository) {
        this.counterpartyRepository = counterpartyRepository;
    }

    @Transactional
    public CounterpartyResponseDto createCounterparty(CreateCounterpartyRequestDto request) {
        Counterparty counterparty = request.toEntity();
        Counterparty savedCounterparty = counterpartyRepository.save(counterparty);

        return CounterpartyResponseDto.fromEntity(savedCounterparty);
    }
}
