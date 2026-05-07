package com.skillstorm.investment_deal_room_backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "counterparties")
@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class Counterparty {

    @Id
    private String id;
    private String organizationName;
    private String contactName;
    private String contactEmail;
    private String contactPhone;

    @Builder.Default
    private boolean deleted = false;

}
