package com.skillstorm.investment_deal_room_backend.dtos.userDtos.response;

import com.skillstorm.investment_deal_room_backend.models.User;

public record UserResponseDto(
    String azureId,
    String department
) {
    public static UserResponseDto fromEntity(User user) {
        return new UserResponseDto(
            user.getAzureId(),
            user.getDepartment()
        );
    }
}
