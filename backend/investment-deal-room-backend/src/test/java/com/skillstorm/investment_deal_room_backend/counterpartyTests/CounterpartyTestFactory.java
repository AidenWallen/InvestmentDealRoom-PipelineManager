package com.skillstorm.investment_deal_room_backend.counterpartyTests;

import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.CreateCounterpartyRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response.CounterpartyResponseDto;
import com.skillstorm.investment_deal_room_backend.models.Counterparty;

public class CounterpartyTestFactory {

    public static Counterparty buildCounterparty(){
        return Counterparty.builder()
            .organizationName("Test Organization Name")
            .primaryContactName("Test Contact Name")
            .contactDetails("Test Contact Details")
            .build();
    }

    public static CreateCounterpartyRequestDto buildCreateCounterpartyRequestDto(Counterparty c){
        return new CreateCounterpartyRequestDto(
            c.getOrganizationName(),
            c.getPrimaryContactName(),
            c.getContactDetails()
        );
    }
}
