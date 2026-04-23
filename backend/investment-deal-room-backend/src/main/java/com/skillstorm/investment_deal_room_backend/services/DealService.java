package com.skillstorm.investment_deal_room_backend.services;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.CreateDealRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response.DealResponseDto;
import com.skillstorm.investment_deal_room_backend.enums.PipelineStage;
import com.skillstorm.investment_deal_room_backend.models.Deal;
import com.skillstorm.investment_deal_room_backend.repositories.DealRepository;


@Service
public class DealService {
    private final DealRepository dealRepository;


    private static final Map<PipelineStage, List<PipelineStage>> PIPELINE_TRANSITIONS = Map.of(
        PipelineStage.PROSPECTING, List.of(PipelineStage.DUE_DILIGENCE),
        PipelineStage.DUE_DILIGENCE, List.of(PipelineStage.NEGOTIATION),
        PipelineStage.NEGOTIATION, List.of(PipelineStage.CLOSING),
        PipelineStage.CLOSING, List.of(PipelineStage.CLOSED_WON),
        PipelineStage.CLOSED_WON, List.of(),
        PipelineStage.CLOSED_LOST, List.of()
    );

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
