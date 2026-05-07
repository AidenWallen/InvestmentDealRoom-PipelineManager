package com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response;

import com.skillstorm.investment_deal_room_backend.enums.DealRole;
import com.skillstorm.investment_deal_room_backend.models.DealCounterparty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DealCounterpartyResponseDto(

        @NotBlank String dealId,
        @NotBlank String counterpartyId,
        @NotNull DealRole dealRole

) {

    public static DealCounterpartyResponseDto fromEntity(DealCounterparty dealCounterparty) {
        return new DealCounterpartyResponseDto(
                dealCounterparty.getDealId(),
                dealCounterparty.getCounterpartyId(),
                dealCounterparty.getDealRole());
    }
}
