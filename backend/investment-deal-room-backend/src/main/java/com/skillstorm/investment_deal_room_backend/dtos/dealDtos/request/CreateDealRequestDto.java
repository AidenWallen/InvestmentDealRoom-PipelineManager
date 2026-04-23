package com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request;

import com.skillstorm.investment_deal_room_backend.enums.Currency;
import com.skillstorm.investment_deal_room_backend.enums.DealType;
import com.skillstorm.investment_deal_room_backend.enums.PipelineStage;
import com.skillstorm.investment_deal_room_backend.models.Deal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateDealRequestDto(
    @NotBlank String dealName,
    @NotNull DealType dealType,
    @NotBlank String targetCompany,
    @NotNull Long estimatedValue,
    @NotBlank Currency currency,
    @NotBlank String assignedManagerId,
    PipelineStage pipelineStage
    
) {
    public Deal toEntity(String createdByUserId) {
        return Deal.builder()
            .dealName(dealName)
            .dealType(dealType)
            .targetCompany(targetCompany)
            .estimatedValue(estimatedValue)
            .currency(currency)
            .assignedManagerId(createdByUserId)
            .pipelineStage(pipelineStage)
            .build();
    }
    
}
