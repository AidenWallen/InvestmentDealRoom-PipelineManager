package com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request;

public record UpdateCounterpartyRequestDto(
        String organizationName,
        String contactName,
        String contactEmail,
        String contactPhone) {

}
