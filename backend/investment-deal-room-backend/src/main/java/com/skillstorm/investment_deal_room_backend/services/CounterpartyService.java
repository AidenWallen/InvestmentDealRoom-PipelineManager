package com.skillstorm.investment_deal_room_backend.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.dao.DuplicateKeyException;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.CreateCounterpartyRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.UpdateCounterpartyRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response.CounterpartyResponseDto;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.DuplicateResourceExceptions.CounterpartyAlreadyExistsException;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.NotFoundExceptions.CounterpartyNotFoundException;
import com.skillstorm.investment_deal_room_backend.models.Counterparty;
import com.skillstorm.investment_deal_room_backend.repositories.CounterpartyRepository;
import com.skillstorm.investment_deal_room_backend.repositories.DealCounterpartyRepository;

@Service
public class CounterpartyService {

    private final CounterpartyRepository counterpartyRepository;

    private final DealCounterpartyRepository dealCounterpartyRepository;

    public CounterpartyService(CounterpartyRepository counterpartyRepository, DealCounterpartyRepository dealCounterpartyRepository) {
        this.counterpartyRepository = counterpartyRepository;
        this.dealCounterpartyRepository = dealCounterpartyRepository;
    }

    @Transactional
    public CounterpartyResponseDto createCounterparty(CreateCounterpartyRequestDto request) {
        
        try{
            Counterparty counterparty = request.toEntity();
            Counterparty savedCounterparty = counterpartyRepository.save(counterparty);

            return CounterpartyResponseDto.fromEntity(savedCounterparty);
        } catch (DuplicateKeyException ex){
            throw new CounterpartyAlreadyExistsException(request.organizationName());
        }
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

    public final Counterparty getCounterpartyEntityById(String id) {
        return counterpartyRepository.findByIdAndDeletedFalse(id)
            .orElseThrow(() -> new CounterpartyNotFoundException(id));
    }

    @Transactional
    public CounterpartyResponseDto updateCounterparty(
            String counterpartyId,
            UpdateCounterpartyRequestDto request) {

        Counterparty counterparty = getCounterpartyEntityById(counterpartyId);

        if (request.organizationName() != null) counterparty.setOrganizationName(request.organizationName());
        if (request.contactName() != null) counterparty.setContactName(request.contactName());
        if (request.contactEmail() != null) counterparty.setContactEmail(request.contactEmail());
        if (request.contactPhone() != null) counterparty.setContactPhone(request.contactPhone());

        try {
            Counterparty updated = counterpartyRepository.save(counterparty);
            return CounterpartyResponseDto.fromEntity(updated);

        } catch (DuplicateKeyException e) {
            throw new CounterpartyAlreadyExistsException(
                counterparty.getOrganizationName()
            );
        }
    }

    @Transactional
    public void deleteCounterparty(String counterpartyId) {

        Counterparty counterparty = getCounterpartyEntityById(counterpartyId);

        counterparty.setDeleted(true);
        counterpartyRepository.save(counterparty);

        dealCounterpartyRepository.deleteByDealId(counterpartyId);
    }
}
