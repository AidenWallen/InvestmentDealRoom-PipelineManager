package com.skillstorm.investment_deal_room_backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import com.skillstorm.investment_deal_room_backend.enums.DealRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "deal_counterparties")
@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@CompoundIndex(
    def = "{'dealId': 1, 'counterpartyId': 1}",
    unique = true
)
public class DealCounterparty {

    @Id
    private String id;
    private String dealId;
    private String counterpartyId;
    private DealRole dealRole;
}
