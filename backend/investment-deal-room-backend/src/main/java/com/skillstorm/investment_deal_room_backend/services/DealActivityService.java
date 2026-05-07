package com.skillstorm.investment_deal_room_backend.services;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response.DealActivityResponseDto;
import com.skillstorm.investment_deal_room_backend.enums.ActivityType;
import com.skillstorm.investment_deal_room_backend.enums.DealRole;
import com.skillstorm.investment_deal_room_backend.enums.PipelineStage;
import com.skillstorm.investment_deal_room_backend.models.DealActivity;
import com.skillstorm.investment_deal_room_backend.models.embedded.ActivityPayload;
import com.skillstorm.investment_deal_room_backend.repositories.DealActivityRepository;

@Service
public class DealActivityService {
    private static final Logger log = LoggerFactory.getLogger(DealActivityService.class);

    private final DealActivityRepository dealActivityRepository;

    public DealActivityService(DealActivityRepository dealActivityRepository) {
        this.dealActivityRepository = dealActivityRepository;
    }

    // Logs a stage transition activity for a deal
    public void logStageTransition(String dealId, String userName, 
                                   PipelineStage fromStage, PipelineStage toStage) {
        
        ActivityType transitionType = determineTransitionType(fromStage, toStage);

        DealActivity activity = DealActivity.builder()
            .dealId(dealId)
            .activityType(transitionType)
            .performedByName(userName)
            .occurredAt(LocalDateTime.now())
            .payload(ActivityPayload.builder()
                .fromStage(fromStage)
                .toStage(toStage)
                .build())
            .build();
        dealActivityRepository.save(activity);
    }

    // Logs when a counterparty is linked to a deal
    public void logCounterpartyLink(String dealId, String userName, 
                                    String counterpartyId, String counterpartyName, DealRole role) {
        DealActivity activity = DealActivity.builder()
            .dealId(dealId)
            .activityType(ActivityType.COUNTERPARTY_LINKED)
            .performedByName(userName)
            .occurredAt(LocalDateTime.now())
            .payload(ActivityPayload.builder()
                .counterpartyId(counterpartyId)
                .counterpartyName(counterpartyName)
                .counterpartyRole(role)
                .build())
            .build();
        dealActivityRepository.save(activity);
    }

    // Logs when a counterparty is unlinked from a deal
    public void logCounterpartyUnlink(String dealId, String userName, 
                                      String counterpartyId, String counterpartyName, DealRole role) {
        DealActivity activity = DealActivity.builder()
            .dealId(dealId)
            .activityType(ActivityType.COUNTERPARTY_UNLINKED)
            .performedByName(userName)
            .occurredAt(LocalDateTime.now())
            .payload(ActivityPayload.builder()
                .counterpartyId(counterpartyId)
                .counterpartyName(counterpartyName)
                .counterpartyRole(role)
                .build())
            .build();
        dealActivityRepository.save(activity);
    }


    public List<DealActivityResponseDto> getActivitiesFeed(String dealId) {
        try {
            return dealActivityRepository.findByDealIdOrderByOccurredAtDesc(dealId).stream()
                .filter(a -> a.getActivityType() != null)
                .map(DealActivityResponseDto::fromEntity)
                .toList();
        } catch (Exception e) {
            log.error("Failed to deserialize activity feed for deal {}: {}", dealId, e.getMessage());
            return List.of();
        }
    }


    private ActivityType determineTransitionType(PipelineStage from, PipelineStage to) {
        return to.ordinal() > from.ordinal() ? ActivityType.STAGE_ADVANCED : ActivityType.STAGE_REVERTED;
    }

}
