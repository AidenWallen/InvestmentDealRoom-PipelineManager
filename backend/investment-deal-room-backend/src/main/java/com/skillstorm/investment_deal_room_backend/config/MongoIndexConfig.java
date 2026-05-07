package com.skillstorm.investment_deal_room_backend.config;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.PartialIndexFilter;
import org.springframework.data.mongodb.core.query.Criteria;

import com.skillstorm.investment_deal_room_backend.models.Counterparty;
import com.skillstorm.investment_deal_room_backend.models.Deal;
import com.skillstorm.investment_deal_room_backend.models.DealCounterparty;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class MongoIndexConfig {

    private final MongoTemplate mongoTemplate;

    @Bean
    public InitializingBean initIndexes() {
        return () -> {
            mongoTemplate.indexOps(Counterparty.class).createIndex(
                new Index()
                    .on("organizationName", Sort.Direction.ASC)
                    .unique()
                    .partial(PartialIndexFilter.of(Criteria.where("deleted").is(false)))
            );

            mongoTemplate.indexOps(Deal.class).createIndex(
                new Index()
                    .on("dealName", Sort.Direction.ASC)
                    .unique()
                    .partial(PartialIndexFilter.of(Criteria.where("deleted").is(false)))
            );

            mongoTemplate.indexOps(DealCounterparty.class).createIndex(
                new Index()
                    .on("dealId", Sort.Direction.ASC)
                    .on("counterpartyId", Sort.Direction.ASC)
                    .unique()
            );
        };
    }
}