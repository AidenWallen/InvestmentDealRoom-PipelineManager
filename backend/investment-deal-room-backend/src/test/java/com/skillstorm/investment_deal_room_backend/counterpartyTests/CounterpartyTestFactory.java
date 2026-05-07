package com.skillstorm.investment_deal_room_backend.counterpartyTests;

import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.CreateCounterpartyRequestDto;
import com.skillstorm.investment_deal_room_backend.models.Counterparty;

public class CounterpartyTestFactory {

    public static Counterparty buildCounterparty() {
        return Counterparty.builder()
            .organizationName("Test Organization Name")
            .contactName("Test Contact Name")
            .contactEmail("test@email.com")
            .contactPhone("123-456-7890")
            .build();
    }

    public static CreateCounterpartyRequestDto buildCreateRequest() {
        return new CreateCounterpartyRequestDto(
            "Test Organization Name",
            "Test Contact Name",
            "test@email.com",
            "123-456-7890"
        );
    }
}
