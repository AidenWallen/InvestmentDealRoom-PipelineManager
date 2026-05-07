package com.skillstorm.investment_deal_room_backend.services;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.dao.DuplicateKeyException;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.CreateDealRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.UpdateDealRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response.DealResponseDto;
import com.skillstorm.investment_deal_room_backend.enums.PipelineStage;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.InvalidStageTransitionException;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.DuplicateResourceExceptions.DealAlreadyExistsException;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.NotFoundExceptions.DealNotFoundException;
import com.skillstorm.investment_deal_room_backend.models.Deal;
import com.skillstorm.investment_deal_room_backend.repositories.DealCounterpartyRepository;
import com.skillstorm.investment_deal_room_backend.repositories.DealRepository;

@Service
public class DealService {
    private final DealRepository dealRepository;
    private final DealCounterpartyRepository dealCounterpartyRepository;
    private final DealActivityService dealActivityService;

    // Define valid pipeline stage transitions
    private static final Map<PipelineStage, List<PipelineStage>> PIPELINE_TRANSITIONS = Map.of(
            PipelineStage.PROSPECTING, List.of(PipelineStage.DUE_DILIGENCE),
            PipelineStage.DUE_DILIGENCE, List.of(PipelineStage.NEGOTIATION, PipelineStage.PROSPECTING),
            PipelineStage.NEGOTIATION, List.of(PipelineStage.CLOSING, PipelineStage.DUE_DILIGENCE),
            PipelineStage.CLOSING,
            List.of(PipelineStage.CLOSED_WON, PipelineStage.CLOSED_LOST, PipelineStage.NEGOTIATION),
            PipelineStage.CLOSED_WON, List.of(),
            PipelineStage.CLOSED_LOST, List.of());

    public DealService(DealRepository dealRepository, DealCounterpartyRepository dealCounterpartyRepository,
            DealActivityService dealActivityService) {
        this.dealRepository = dealRepository;
        this.dealCounterpartyRepository = dealCounterpartyRepository;
        this.dealActivityService = dealActivityService;
    }

    @Transactional
    public DealResponseDto createDeal(CreateDealRequestDto request, String createdByUserId) {

        try {
            Deal deal = request.toEntity(createdByUserId);

            Deal savedDeal = dealRepository.save(deal);
            return DealResponseDto.fromEntity(savedDeal);

        } catch (DuplicateKeyException e) {
            throw new DealAlreadyExistsException(request.dealName());
        }
    }

    public List<DealResponseDto> getAllDeals() {
        List<Deal> deals = dealRepository.findByDeletedFalse();
        return deals.stream()
                .map(DealResponseDto::fromEntity)
                .toList();
    }

    public DealResponseDto getDealById(String id) {
        Deal deal = getDealEntityById(id);
        return DealResponseDto.fromEntity(deal);
    }

    @Transactional
    public DealResponseDto updateDeal(String id, UpdateDealRequestDto request) {

        Deal deal = getDealEntityById(id);

        if (request.dealName() != null)
            deal.setDealName(request.dealName());
        if (request.dealType() != null)
            deal.setDealType(request.dealType());
        if (request.targetCompany() != null)
            deal.setTargetCompany(request.targetCompany());
        if (request.estimatedValue() != null)
            deal.setEstimatedValue(request.estimatedValue());
        if (request.currency() != null)
            deal.setCurrency(request.currency());

        try {
            return DealResponseDto.fromEntity(dealRepository.save(deal));
        } catch (DuplicateKeyException e) {
            throw new DealAlreadyExistsException(request.dealName());
        }
    }

    @Transactional
    public DealResponseDto updatePipelineStage(String id, String userName, PipelineStage newStage) {
        Deal deal = getDealEntityById(id);
        PipelineStage currentStage = deal.getPipelineStage();

        if (!PIPELINE_TRANSITIONS.get(currentStage).contains(newStage)) {
            throw new InvalidStageTransitionException(
                    "Invalid pipeline stage transition from " + currentStage + " to " + newStage);
        }

        dealActivityService.logStageTransition(deal.getId(), userName, currentStage, newStage);
        deal.setPipelineStage(newStage);
        Deal updatedDeal = dealRepository.save(deal);

        return DealResponseDto.fromEntity(updatedDeal);
    }

    @Transactional
    public void deleteDeal(String id) {
        Deal deal = getDealEntityById(id);

        deal.setDeleted(true);
        dealRepository.save(deal);

        dealCounterpartyRepository.deleteByDealId(id);
    }

    /**
     * Helper method to retrieve a Deal entity by ID, throwing an exception if not
     * found.
     * 
     * @param id
     * @return
     */
    public final Deal getDealEntityById(String id) {
        return dealRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new DealNotFoundException(id));
    }

}
