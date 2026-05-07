package com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request;

import com.skillstorm.investment_deal_room_backend.models.Counterparty;

import jakarta.validation.constraints.NotBlank;

public record CreateCounterpartyRequestDto(
        @NotBlank String organizationName,
        @NotBlank String contactName,
        @NotBlank String contactEmail,
        @NotBlank String contactPhone) {
    public Counterparty toEntity() {
        return Counterparty.builder()
                .organizationName(organizationName)
                .contactName(contactName)
                .contactEmail(contactEmail)
                .contactPhone(contactPhone)
                .build();
    }
}
