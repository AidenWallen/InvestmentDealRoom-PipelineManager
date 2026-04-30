package com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request;


import java.math.BigDecimal;

import com.skillstorm.investment_deal_room_backend.enums.Currency;
import com.skillstorm.investment_deal_room_backend.enums.DealType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record UpdateDealRequestDto(
    @NotBlank String dealName,
    @NotNull DealType dealType,
    @NotBlank String targetCompany,
    @NotNull @PositiveOrZero BigDecimal estimatedValue,
    @NotNull Currency currency
) {} 

