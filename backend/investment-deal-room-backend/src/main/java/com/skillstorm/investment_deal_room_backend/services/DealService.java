package com.skillstorm.investment_deal_room_backend.services;

import java.util.List;

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

    public List<DealResponseDto> getAllDeals() {
        List<Deal> deals = dealRepository.findAll();
        return deals.stream()
            .map(DealResponseDto::fromEntity)
            .toList();
    }

    public DealResponseDto getDealById(String id) {
        Deal deal = dealRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Deal not found with id: " + id));
        return DealResponseDto.fromEntity(deal);
    }
}
