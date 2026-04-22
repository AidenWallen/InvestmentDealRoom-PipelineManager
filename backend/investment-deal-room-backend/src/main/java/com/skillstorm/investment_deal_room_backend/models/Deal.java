package com.skillstorm.investment_deal_room_backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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


}
