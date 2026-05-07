package com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request;

import com.skillstorm.investment_deal_room_backend.enums.DealRole;
import com.skillstorm.investment_deal_room_backend.models.DealCounterparty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LinkCounterpartyDealRequestDto(
        @NotBlank String dealId,
        @NotNull DealRole dealRole) {

    public DealCounterparty toEntity(String counterpartyId) {
        return DealCounterparty.builder()
                .dealId(dealId)
                .counterpartyId(counterpartyId)
                .dealRole(dealRole)
                .build();
    }
}
