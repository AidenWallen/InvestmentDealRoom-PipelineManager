package com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request;


import java.math.BigDecimal;

import com.skillstorm.investment_deal_room_backend.enums.Currency;
import com.skillstorm.investment_deal_room_backend.enums.DealType;

public record UpdateDealRequestDto(
    String dealName,
    DealType dealType,
    String targetCompany,
    BigDecimal estimatedValue,
    Currency currency
) {} 

