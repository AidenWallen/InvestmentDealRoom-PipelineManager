package com.skillstorm.investment_deal_room_backend.models.embedded;

import java.util.Map;

import com.skillstorm.investment_deal_room_backend.enums.DealRole;
import com.skillstorm.investment_deal_room_backend.enums.PipelineStage;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityPayload {

    
    private PipelineStage fromStage;
    private PipelineStage toStage;

    private String counterpartyId;
    private String counterpartyName;
    private DealRole counterpartyRole;

    // For deal updates — what fields changed
    private Map<String, String> changedFields; 
}
