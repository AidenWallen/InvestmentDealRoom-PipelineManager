package com.skillstorm.investment_deal_room_backend.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.CreateCounterpartyRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.UpdateCounterpartyRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response.CounterpartyResponseDto;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.NotFoundExceptions.CounterpartyNotFoundException;
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

    public List<CounterpartyResponseDto> getAllCounterparties(){
        return counterpartyRepository.findByDeletedFalse()
            .stream()
            .map(CounterpartyResponseDto::fromEntity)
            .toList();
    }

    public CounterpartyResponseDto getCounterpartyById(String id){
        return CounterpartyResponseDto.fromEntity(
            getCounterpartyEntityById(id)
        );
    }

    private final Counterparty getCounterpartyEntityById(String id) {
        return counterpartyRepository.findByIdAndDeletedFalse(id)
            .orElseThrow(() -> new CounterpartyNotFoundException(id));
    }

    public CounterpartyResponseDto updateCounterparty(String counterpartyId, UpdateCounterpartyRequestDto request) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateCounterparty'");
    }

    public CounterpartyResponseDto deleteCounterparty(String counterpartyId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteCounterparty'");
    }
}
