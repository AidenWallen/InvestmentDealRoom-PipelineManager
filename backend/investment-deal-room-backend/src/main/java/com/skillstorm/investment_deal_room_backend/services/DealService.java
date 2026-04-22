package com.skillstorm.investment_deal_room_backend.services;

import org.springframework.stereotype.Service;

import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.CreateDealRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response.DealResponseDto;
import com.skillstorm.investment_deal_room_backend.models.Deal;
import com.skillstorm.investment_deal_room_backend.repositories.DealRepository;


@Service
public class DealService {
    private final DealRepository dealRepository;

    public DealService(DealRepository dealRepository) {
        this.dealRepository = dealRepository;
    }

    
    public DealResponseDto createDeal(CreateDealRequestDto request, String createdByUserId) {
        Deal deal = request.toEntity(createdByUserId);
        Deal savedDeal = dealRepository.save(deal);
        return DealResponseDto.fromEntity(savedDeal);
    }
}
