package com.skillstorm.investment_deal_room_backend.dealTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.assertThatNoException;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.CreateDealRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response.DealResponseDto;
import com.skillstorm.investment_deal_room_backend.enums.Currency;
import com.skillstorm.investment_deal_room_backend.enums.DealType;
import com.skillstorm.investment_deal_room_backend.enums.PipelineStage;
import com.skillstorm.investment_deal_room_backend.models.Deal;
import com.skillstorm.investment_deal_room_backend.repositories.DealRepository;
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
        deal.setCurrency(Currency.USD);
        deal.setAssignedManagerId("manager-01");
        deal.setPipelineStage(stage);
        return deal;
    }

    private CreateDealRequestDto buildCreateDealRequestDto() {
        return new CreateDealRequestDto(
            "Project Falcon",
            DealType.MERGER_ACQUISITION,
            "Horizon Capital LLC",
            4_200_000_000L,
            Currency.USD,
            "manager-01",
            PipelineStage.PROSPECTING
        );
    }


    /**
     * 
     * Tests for Create Deal
     * 
     */

    @Test
    @DisplayName("createDeal: valid request should create and return a deal")
    public void testCreateDeal() {
        CreateDealRequestDto requestDto = buildCreateDealRequestDto();
        Deal savedDeal = buildDeal("deal-01", PipelineStage.PROSPECTING);

        when(dealRepository.save(any(Deal.class))).thenReturn(savedDeal);

        DealResponseDto result = dealService.createDeal(requestDto, "manager-01");

   
        assertNotNull(result);
        assertThat(result.dealName()).isEqualTo(requestDto.dealName());
        assertThat(result.dealType()).isEqualTo(requestDto.dealType());
        assertThat(result.targetCompany()).isEqualTo(requestDto.targetCompany());
        assertThat(result.estimatedValue()).isEqualTo(requestDto.estimatedValue());
        assertThat(result.currency()).isEqualTo(requestDto.currency());
        assertThat(result.assignedManagerId()).isEqualTo("manager-01");
        assertThat(result.pipelineStage()).isEqualTo(requestDto.pipelineStage());

        verify(dealRepository, times(1)).save(any(Deal.class));
    }




    /**
     * 
     * Tests for getDeal
     * 
     */

    @Test
    @DisplayName("getDealById: existing id returns DealResponseDto")
    void getDealById_existingId_returnsDeal() {
        Deal deal = buildDeal("deal-01", PipelineStage.PROSPECTING);
        when(dealRepository.findById("deal-01")).thenReturn(Optional.of(deal));

        DealResponseDto response = dealService.getDealById("deal-01");

        assertThat(response.id()).isEqualTo("deal-01");
        assertThat(response.dealName()).isEqualTo("Project Falcon");
    }

    @Test
    @DisplayName("getDealById: unknown id throws DealNotFoundException")
    void getDealById_unknownId_throwsDealNotFoundException() {
        when(dealRepository.findById("bad-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> dealService.getDealById("bad-id"))
            .isInstanceOf(Exception.class);
    }

}
