package com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request;

import com.skillstorm.investment_deal_room_backend.enums.PipelineStage;
import jakarta.validation.constraints.NotNull;

public record UpdatePipelineStageRequestDto(
    @NotNull(message = "Pipeline stage must not be null")
    PipelineStage pipelineStage
) {
    
}
