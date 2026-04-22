package com.skillstorm.investment_deal_room_backend.models;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.skillstorm.investment_deal_room_backend.enums.Currency;
import com.skillstorm.investment_deal_room_backend.enums.DealType;
import com.skillstorm.investment_deal_room_backend.enums.PipelineStage;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "deals")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Deal {
    @Id
    private String id;

    private String dealName;
    private DealType dealType;
    private String targetCompany;
    private long estimatedValue;
    private Currency currency;
    private PipelineStage pipelineStage;
    private String assignedManagerId;


}
