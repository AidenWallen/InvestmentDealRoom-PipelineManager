package com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response;

import com.skillstorm.investment_deal_room_backend.models.Counterparty;

public record CounterpartyResponseDto(
    String id,
    String organizationName,
    String primaryContactName,
    String contactDetails
) {
    public static CounterpartyResponseDto fromEntity(Counterparty counterparty){
        return new CounterpartyResponseDto(
            counterparty.getId(),
            counterparty.getOrganizationName(),
            counterparty.getPrimaryContactName(),
            counterparty.getContactDetails()
        );
    }
}
