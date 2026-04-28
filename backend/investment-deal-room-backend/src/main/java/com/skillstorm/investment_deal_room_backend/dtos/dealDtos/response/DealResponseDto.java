package com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response;

import java.math.BigDecimal;

import com.skillstorm.investment_deal_room_backend.enums.Currency;
import com.skillstorm.investment_deal_room_backend.enums.DealType;
import com.skillstorm.investment_deal_room_backend.enums.PipelineStage;
import com.skillstorm.investment_deal_room_backend.models.Deal;

public record DealResponseDto(
    String id,
    String dealName,
    DealType dealType,
    String targetCompany,
    BigDecimal estimatedValue,
    Currency currency,
    String assignedManagerId,
    PipelineStage pipelineStage
) {

    public static DealResponseDto fromEntity(Deal deal) {
        return new DealResponseDto(
            deal.getId(),
            deal.getDealName(),
            deal.getDealType(),
            deal.getTargetCompany(),
            deal.getEstimatedValue(),
            deal.getCurrency(),
            deal.getAssignedManagerId(),
            deal.getPipelineStage()
        );
    }

}
