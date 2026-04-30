package com.skillstorm.investment_deal_room_backend.services;

import java.time.LocalDateTime;
import java.util.List;

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
    private final DealActivityRepository dealActivityRepository;

    public DealActivityService(DealActivityRepository dealActivityRepository) {
        this.dealActivityRepository = dealActivityRepository;
    }

    // Logs a stage transition activity for a deal
    public void logStageTransition(String dealId, String userId, String userName, 
                                   PipelineStage fromStage, PipelineStage toStage) {
        
        ActivityType transitionType = determineTransitionType(fromStage, toStage);

        DealActivity activity = DealActivity.builder()
            .dealId(dealId)
            .activityType(transitionType)
            .performedBy(userId)
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
    public void logCounterpartyLink(String dealId, String userId, String userName, 
                                    String counterpartyId, String counterpartyName, DealRole role) {
        DealActivity activity = DealActivity.builder()
            .dealId(dealId)
            .activityType(ActivityType.COUNTERPARTY_LINKED)
            .performedBy(userId)
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
    public void logCounterpartyUnlink(String dealId, String userId, String userName, 
                                      String counterpartyId, String counterpartyName, DealRole role) {
        DealActivity activity = DealActivity.builder()
            .dealId(dealId)
            .activityType(ActivityType.COUNTERPARTY_UNLINKED)
            .performedBy(userId)
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

    // Logs when a deal is deleted
    public void logDealDeletion(String dealId, String userId, String userName) {
        DealActivity activity = DealActivity.builder()
            .dealId(dealId)
            .activityType(ActivityType.DEAL_DELETED)
            .performedBy(userId)
            .performedByName(userName)
            .occurredAt(LocalDateTime.now())
            .build();
        dealActivityRepository.save(activity);
    }

    //
    public void logDealUpdate(String dealId, String userId, String userName, 
                              java.util.Map<String, String> changedFields) {
        DealActivity activity = DealActivity.builder()
            .dealId(dealId)
            .activityType(ActivityType.DEAL_UPDATED)
            .performedBy(userId)
            .performedByName(userName)
            .occurredAt(LocalDateTime.now())
            .payload(ActivityPayload.builder()
                .changedFields(changedFields)
                .build())
            .build();
        dealActivityRepository.save(activity);
    }

    // Logs when a deal is created
    public void recordDealCreation(String dealId, String userId, String userName) {
        DealActivity activity = DealActivity.builder()
            .dealId(dealId)
            .activityType(ActivityType.DEAL_CREATED)
            .performedBy(userId)
            .performedByName(userName)
            .occurredAt(LocalDateTime.now())
            .build();
        dealActivityRepository.save(activity);
    }

    public List<DealActivityResponseDto> getActivitiesFeed(String dealId) {
        return dealActivityRepository.findByDealIdOrderByOccurredAtDesc(dealId).stream()
            .map(DealActivityResponseDto::fromEntity)
            .toList();
    }


    private ActivityType determineTransitionType(PipelineStage from, PipelineStage to) {
        return to.ordinal() > from.ordinal() ? ActivityType.STAGE_ADVANCED : ActivityType.STAGE_REVERTED;
    }

}
