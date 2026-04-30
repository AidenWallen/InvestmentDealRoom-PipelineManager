package com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request;

import com.skillstorm.investment_deal_room_backend.models.Counterparty;

import jakarta.validation.constraints.NotBlank;

public record CreateCounterpartyRequestDto(
    @NotBlank String organizationName,
    @NotBlank String primaryContactName,
    @NotBlank String contactDetails
) {
    public Counterparty toEntity(){
        return Counterparty.builder()
            .organizationName(organizationName)
            .primaryContactName(primaryContactName)
            .contactDetails(contactDetails)
            .build();
    }
}
