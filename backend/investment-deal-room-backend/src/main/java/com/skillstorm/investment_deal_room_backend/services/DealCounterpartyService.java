package com.skillstorm.investment_deal_room_backend.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.LinkCounterpartyDealRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.LinkDealCounterpartyRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response.DealCounterpartyResponseDto;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.NotFoundExceptions.CounterpartyNotFoundException;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.NotFoundExceptions.DealNotFoundException;
import com.skillstorm.investment_deal_room_backend.models.DealCounterparty;
import com.skillstorm.investment_deal_room_backend.repositories.DealCounterpartyRepository;

import jakarta.validation.Valid;

@Service
public class DealCounterpartyService {

    private final DealCounterpartyRepository dcpRepository;

    public DealCounterpartyService(DealCounterpartyRepository dcpRepository){
        this.dcpRepository = dcpRepository;
    }

    public List<DealCounterpartyResponseDto> getCounterpartiesByDealId(String dealId) {
        List<DealCounterparty> list = dcpRepository.findByDealId(dealId);

        if(list.isEmpty())
            throw new DealNotFoundException(dealId);

        return list.stream()
            .map(DealCounterpartyResponseDto::fromEntity)
            .toList();
    }

    public List<DealCounterpartyResponseDto> getDealsByCounterpartyId(String counterpartyId) {
        List<DealCounterparty> list = dcpRepository.findByCounterpartyId(counterpartyId);

        if(list.isEmpty())
            throw new CounterpartyNotFoundException(counterpartyId);

        return list.stream()
            .map(DealCounterpartyResponseDto::fromEntity)
            .toList();
    }

    public DealCounterpartyResponseDto linkDealToCounterparty(String dealId,
            LinkDealCounterpartyRequestDto request) {
        DealCounterparty dealCounterparty = request.toEntity(dealId);
        DealCounterparty savedDealCounterparty = dcpRepository.save(dealCounterparty);

        return DealCounterpartyResponseDto.fromEntity(savedDealCounterparty);
    }

    public DealCounterpartyResponseDto linkCounterpartyToDeal(String counterpartyId,
            LinkCounterpartyDealRequestDto request) {
        DealCounterparty dealCounterparty = request.toEntity(counterpartyId);
        DealCounterparty savedDealCounterparty = dcpRepository.save(dealCounterparty);

        return DealCounterpartyResponseDto.fromEntity(savedDealCounterparty);
    }

    public DealCounterpartyResponseDto unlinkDealCounterparty(String dealId, String counterpartyId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'unlinkDealCounterparty'");
    }



}
