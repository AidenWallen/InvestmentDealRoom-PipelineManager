package com.skillstorm.investment_deal_room_backend.dealTests;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.skillstorm.investment_deal_room_backend.enums.PipelineStage;
import com.skillstorm.investment_deal_room_backend.models.Deal;
import com.skillstorm.investment_deal_room_backend.repository.DealRepository;
import com.skillstorm.investment_deal_room_backend.services.DealService;

@ExtendWith(MockitoExtension.class)
public class DealServiceTest {

    @Mock
    private DealRepository dealRepository;

    @InjectMocks
    private DealService dealService;


     private Deal buildDeal(String id, PipelineStage stage) {
        Deal deal = new Deal();
        deal.setId(id);
        deal.setDealName("Project Falcon");
        deal.setDealType(DealType.MERGER_ACQUISITION);
        deal.setTargetCompany("Horizon Capital LLC");
        deal.setEstimatedValue(4_200_000_000L);
        deal.setCurrency("USD");
        deal.setPipelineStage(stage);
        return deal;
    }


}
