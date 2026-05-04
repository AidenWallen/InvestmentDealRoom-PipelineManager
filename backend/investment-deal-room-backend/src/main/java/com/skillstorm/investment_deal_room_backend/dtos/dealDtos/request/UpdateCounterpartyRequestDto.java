package com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request;

public record UpdateCounterpartyRequestDto(
    String organizationName,
    String primaryContactName,
    String contactEmail,
    String contactPhone
) {

}
