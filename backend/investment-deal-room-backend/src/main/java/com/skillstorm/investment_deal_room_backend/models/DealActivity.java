package com.skillstorm.investment_deal_room_backend.models;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.skillstorm.investment_deal_room_backend.enums.ActivityType;
import com.skillstorm.investment_deal_room_backend.models.embedded.ActivityPayload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Document(collection = "deal_activity")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DealActivity {
    @Id
    private String id;

    @Indexed
    private String dealId;

    private ActivityType activityType;   
    private String performedByName;    
    private LocalDateTime occurredAt;

    private ActivityPayload payload;  

}
