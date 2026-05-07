package com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response;

import java.time.LocalDateTime;

import com.skillstorm.investment_deal_room_backend.models.DealActivity;
import com.skillstorm.investment_deal_room_backend.models.embedded.ActivityPayload;

public record DealActivityResponseDto(
        String id,
        String activityType,
        String performedByName,
        LocalDateTime occurredAt,
        ActivityPayload payload) {
    public static DealActivityResponseDto fromEntity(DealActivity activity) {
        String typeDescription = activity.getActivityType() != null
                ? activity.getActivityType().getDescription()
                : "unknown activity";
        return new DealActivityResponseDto(
                activity.getId(),
                typeDescription,
                activity.getPerformedByName(),
                activity.getOccurredAt(),
                activity.getPayload());
    }
}
