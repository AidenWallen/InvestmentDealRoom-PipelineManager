package com.skillstorm.investment_deal_room_backend.dtos.userDtos.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateDepartmentRequestDto(
    @NotBlank String department
) {
}
