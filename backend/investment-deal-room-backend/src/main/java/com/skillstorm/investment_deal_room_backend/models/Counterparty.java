package com.skillstorm.investment_deal_room_backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
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
@CompoundIndex(
    def = "{'organizationName': 1}",
    unique = true,
    partialFilter = "{ 'deleted': false }"
)
public class Counterparty {

    @Id
    private String id;
    private String organizationName;
    private String primaryContactName;
    private String contactEmail;
    private String contactPhone;

    @Indexed
    @Builder.Default
    private boolean deleted = false;

}
