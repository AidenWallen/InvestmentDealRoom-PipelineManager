package com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request;


import java.math.BigDecimal;

import com.skillstorm.investment_deal_room_backend.enums.Currency;
import com.skillstorm.investment_deal_room_backend.enums.DealType;

import jakarta.validation.constraints.PositiveOrZero;

public record UpdateDealRequestDto(
    String dealName,
    DealType dealType,
    String targetCompany,
    @PositiveOrZero BigDecimal estimatedValue,
    Currency currency
) {} 

