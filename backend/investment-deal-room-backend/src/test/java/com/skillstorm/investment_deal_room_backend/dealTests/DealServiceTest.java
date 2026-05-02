package com.skillstorm.investment_deal_room_backend.dealTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;

import static org.mockito.Mockito.never;
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

import com.skillstorm.investment_deal_room_backend.counterpartyTests.CounterpartyTestFactory;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.CreateCounterpartyRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.CreateDealRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.UpdateDealRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response.DealResponseDto;
import com.skillstorm.investment_deal_room_backend.enums.Currency;
import com.skillstorm.investment_deal_room_backend.enums.DealType;
import com.skillstorm.investment_deal_room_backend.enums.PipelineStage;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.InvalidStageTransitionException;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.DuplicateResourceExceptions.CounterpartyAlreadyExistsException;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.DuplicateResourceExceptions.DealAlreadyExistsException;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.NotFoundExceptions.DealNotFoundException;
import com.skillstorm.investment_deal_room_backend.models.Counterparty;
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
        deal.setEstimatedValue(new BigDecimal("4200000000"));
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
            new BigDecimal("4200000000"),
            Currency.USD,
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
        Deal savedDeal = buildDeal("1", PipelineStage.PROSPECTING);

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

    @Test
    @DisplayName("createDeal: throws an exception when the Deal name already exists")
    void testCreateDealNameExists() {

        CreateDealRequestDto request = buildCreateDealRequestDto();

        when(dealRepository.existsByDealNameAndDeletedFalse(request.dealName()))
                .thenReturn(true);

        assertThrows(DealAlreadyExistsException.class, () -> {
            dealService.createDeal(request, "manager-01");
        });

        verify(dealRepository, never()).save(any(Deal.class));
    }


    /**
     * 
     * Tests for getDeal
     * 
     */

    @Test
    @DisplayName("getDealById: existing id returns DealResponseDto")
    void getDealById_returnsDeal() {
        Deal deal = buildDeal("1", PipelineStage.PROSPECTING);
        when(dealRepository.findByIdAndDeletedFalse("1")).thenReturn(Optional.of(deal));

        DealResponseDto response = dealService.getDealById("1");

        assertThat(response.id()).isEqualTo("1");
        assertThat(response.dealName()).isEqualTo("Project Falcon");
    }

    @Test
    @DisplayName("getDealById: unknown id throws DealNotFoundException")
    void getDealById_unknownId_throwsDealNotFoundException() {
        when(dealRepository.findByIdAndDeletedFalse("1")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> dealService.getDealById("1"))
            .isInstanceOf(DealNotFoundException.class);
    }

    /**
     * 
     * Tests for advancing pipeline stage
     * 
     */
    @Test
    @DisplayName("advanceStage: PROSPECTING -> DUE_DILIGENCE succeeds")
    void advanceStage_prospectingToDueDiligence_succeeds() {
        Deal deal = buildDeal("deal-01", PipelineStage.PROSPECTING);
        when(dealRepository.findByIdAndDeletedFalse("deal-01")).thenReturn(Optional.of(deal));
        when(dealRepository.save(any(Deal.class))).thenAnswer(inv -> inv.getArgument(0));

        DealResponseDto response = dealService.updatePipelineStage("deal-01", PipelineStage.DUE_DILIGENCE);

        assertThat(response.pipelineStage()).isEqualTo(PipelineStage.DUE_DILIGENCE);
        verify(dealRepository).save(deal);
    }


    @Test
    @DisplayName("advanceStage: PROSPECTING -> CLOSING throws InvalidStageTransitionException")
    void updateStage_prospectingToClosing_throwsInvalidTransition() {
        Deal deal = buildDeal("deal-01", PipelineStage.PROSPECTING);
        when(dealRepository.findByIdAndDeletedFalse("deal-01")).thenReturn(Optional.of(deal));

        assertThatThrownBy(() ->
            dealService.updatePipelineStage("deal-01", PipelineStage.CLOSING)
        ).isInstanceOf(InvalidStageTransitionException.class);

        verify(dealRepository, never()).save(any());
    }


    @Test
    @DisplayName("advanceStage: CLOSED_WON is terminal,  any transition throws")
    void updateStage_fromClosedWon_throwsInvalidStageTransitionException() {
        Deal deal = buildDeal("deal-01", PipelineStage.CLOSED_WON);
        when(dealRepository.findByIdAndDeletedFalse("deal-01")).thenReturn(Optional.of(deal));

        assertThatThrownBy(() ->
            dealService.updatePipelineStage("deal-01", PipelineStage.NEGOTIATION)
        ).isInstanceOf(InvalidStageTransitionException.class);

        verify(dealRepository, never()).save(any());
    }


    @Test
    @DisplayName("advanceStage: deal not found throws DealNotFoundException")
    void updateStage_dealNotFound_throwsDealNotFoundException() {
        when(dealRepository.findByIdAndDeletedFalse("bad-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() ->
            dealService.updatePipelineStage("bad-id", PipelineStage.DUE_DILIGENCE)
        ).isInstanceOf(DealNotFoundException.class);
    }

    @Test
    @DisplayName("advanceStage: NEGOTIATION -> DUE_DILIGENCE revert succeeds")
    void updateStage_revertNegotiationToDueDiligence_succeeds() {
        Deal deal = buildDeal("deal-01", PipelineStage.NEGOTIATION);
        when(dealRepository.findByIdAndDeletedFalse("deal-01")).thenReturn(Optional.of(deal));
        when(dealRepository.save(any(Deal.class))).thenAnswer(inv -> inv.getArgument(0));

        DealResponseDto response = dealService.updatePipelineStage("deal-01", PipelineStage.DUE_DILIGENCE);

        assertThat(response.pipelineStage()).isEqualTo(PipelineStage.DUE_DILIGENCE);
    }

    
    /**
     * 
     * Tests for updateDeal (partial updates)
     * 
     */

    @Test
    @DisplayName("updateDeal: valid request updates and saves deal")
    void updateDeal_validRequest_returnsUpdatedDeal() {
        Deal deal = buildDeal("deal-01", PipelineStage.PROSPECTING);
        when(dealRepository.findByIdAndDeletedFalse("deal-01")).thenReturn(Optional.of(deal));
        when(dealRepository.save(any(Deal.class))).thenAnswer(inv -> inv.getArgument(0));

        UpdateDealRequestDto update = new UpdateDealRequestDto(
            "Project Phoenix", null, null, null, null
        );

        DealResponseDto response = dealService.updateDeal("deal-01", update);

        assertThat(response.dealName()).isEqualTo("Project Phoenix");
        verify(dealRepository).save(any(Deal.class));
    }

    @Test
    @DisplayName("updateDeal: partial update only modifies provided fields")
    void updateDeal_partialUpdate_onlyChangesProvidedFields() {
        Deal deal = buildDeal("deal-01", PipelineStage.DUE_DILIGENCE);
        when(dealRepository.findByIdAndDeletedFalse("deal-01")).thenReturn(Optional.of(deal));
        when(dealRepository.save(any(Deal.class))).thenAnswer(inv -> inv.getArgument(0));

        // Only update currency, everything else should stay the same
        UpdateDealRequestDto update = new UpdateDealRequestDto(
            null, null, null, null, Currency.GBP
        );

        DealResponseDto response = dealService.updateDeal("deal-01", update);

        assertThat(response.currency()).isEqualTo(Currency.GBP);
        assertThat(response.dealName()).isEqualTo("Project Falcon");
        assertThat(response.pipelineStage()).isEqualTo(PipelineStage.DUE_DILIGENCE);
    }

    @Test
    @DisplayName("updateDeal: unknown id throws DealNotFoundException")
    void updateDeal_unknownId_throwsDealNotFoundException() {
        when(dealRepository.findByIdAndDeletedFalse("bad-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() ->
            dealService.updateDeal("bad-id", new UpdateDealRequestDto(null,null,null,null,null))
        ).isInstanceOf(DealNotFoundException.class);
    }

    @Test
    @DisplayName("updateDeal: duplicate deal names throw DealAlreadyExistsException")
    void updateDeal_duplicateName_throwsDealAlreadyExistsException() {

        String dealId = "deal-123";

        UpdateDealRequestDto request = new UpdateDealRequestDto(
            "Project Phoenix", null, null, null, null
        );

        Deal existingDeal = Deal.builder()
            .id(dealId)
            .dealName("Old Name")
            .build();

        when(dealRepository.findByIdAndDeletedFalse(dealId))
                .thenReturn(Optional.of(existingDeal));

        when(dealRepository.existsByDealNameAndDeletedFalse(request.dealName()))
                .thenReturn(true);

        assertThrows(DealAlreadyExistsException.class, () -> {
            dealService.updateDeal(dealId, request);
        });

        verify(dealRepository, never()).save(any(Deal.class));
    }

    /**
     * 
     * Test for deleteDeal (soft delete)
     */

    @Test
    @DisplayName("deleteDeal: existing deal soft is deleted without error")
    void deleteDeal_existingId_deletesSuccessfully() {
        Deal deal = buildDeal("deal-01", PipelineStage.PROSPECTING);
        when(dealRepository.findByIdAndDeletedFalse("deal-001")).thenReturn(Optional.of(deal));
        when(dealRepository.save(any(Deal.class))).thenAnswer(inv -> inv.getArgument(0));

        assertThatNoException().isThrownBy(() -> dealService.deleteDeal("deal-001"));
        assertThat(deal.isDeleted()).isTrue();
        verify(dealRepository).save(deal);
    }

    @Test
    @DisplayName("deleteDeal: unknown id throws DealNotFoundException before attempting delete")
    void deleteDeal_unknownId_throwsWithoutCallingDelete() {
        when(dealRepository.findByIdAndDeletedFalse("bad-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> dealService.deleteDeal("bad-id"))
            .isInstanceOf(DealNotFoundException.class);

        verify(dealRepository, never()).deleteById(any());
    }


}
