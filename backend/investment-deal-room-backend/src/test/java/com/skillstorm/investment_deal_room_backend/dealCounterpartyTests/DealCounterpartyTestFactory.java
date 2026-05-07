package com.skillstorm.investment_deal_room_backend.dealCounterpartyTests;

import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.LinkCounterpartyDealRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.LinkDealCounterpartyRequestDto;
import com.skillstorm.investment_deal_room_backend.enums.DealRole;
import com.skillstorm.investment_deal_room_backend.models.DealCounterparty;

public class DealCounterpartyTestFactory {

    public static DealCounterparty buildDealCounterparty() {
        return DealCounterparty.builder()
            .dealId("0000")
            .counterpartyId("0000")
            .dealRole(DealRole.ACQUIRER)
            .build();
    }

    public static LinkDealCounterpartyRequestDto buildDealLinkRequest() {
        return new LinkDealCounterpartyRequestDto(
            "0000",
            DealRole.ACQUIRER
        );
    }

    public static LinkCounterpartyDealRequestDto buildCounterpartyLinkRequest() {
        return new LinkCounterpartyDealRequestDto(
            "0000",
            DealRole.ACQUIRER
        );
    }
}
