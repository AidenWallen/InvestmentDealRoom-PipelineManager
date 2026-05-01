package com.skillstorm.investment_deal_room_backend.dealCounterpartyTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.LinkCounterpartyDealRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.LinkDealCounterpartyRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response.DealCounterpartyResponseDto;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.NotFoundExceptions.CounterpartyNotFoundException;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.NotFoundExceptions.DealNotFoundException;
import com.skillstorm.investment_deal_room_backend.models.DealCounterparty;
import com.skillstorm.investment_deal_room_backend.repositories.DealCounterpartyRepository;
import com.skillstorm.investment_deal_room_backend.services.DealCounterpartyService;

@ExtendWith(MockitoExtension.class)
public class DealCounterpartyServiceTest {

    @Mock
    private DealCounterpartyRepository dcpRepository;

    @InjectMocks
    private DealCounterpartyService dcpService;
    
    /**
     * 
     * TEST LINK DEAL TO COUNTERPARTY
     * 
     */

    @Test
    @DisplayName("linkDealToCounterparty: valid request should create and return a DealCounterparty")
    void testCreateDealCounterparty() {

        DealCounterparty savedDcp = DealCounterpartyTestFactory.buildDealCounterparty();

        when(dcpRepository.save(any(DealCounterparty.class)))
            .thenReturn(savedDcp);

        LinkDealCounterpartyRequestDto request = DealCounterpartyTestFactory.buildDealLinkRequest();
        DealCounterpartyResponseDto result = dcpService.linkDealToCounterparty("0000", request);

        assertEquals(request.counterpartyId(), result.counterpartyId());
        assertEquals("0000", result.dealId());
        assertEquals(request.dealRole(), result.dealRole());

        verify(dcpRepository).save(any(DealCounterparty.class));
    }

    @Test
    @DisplayName("linkCounterpartyToDeal: valid request should create and return a DealCounterparty")
    void testCreateCounterpartyDeal() {

        DealCounterparty savedDcp = DealCounterpartyTestFactory.buildDealCounterparty();

        when(dcpRepository.save(any(DealCounterparty.class)))
            .thenReturn(savedDcp);

        LinkCounterpartyDealRequestDto request = DealCounterpartyTestFactory.buildCounterpartyLinkRequest();
        DealCounterpartyResponseDto result = dcpService.linkCounterpartyToDeal("0000", request);

        assertEquals("0000", result.counterpartyId());
        assertEquals(request.dealId(), result.dealId());
        assertEquals(request.dealRole(), result.dealRole());

        verify(dcpRepository).save(any(DealCounterparty.class));
    }

    /**
     * 
     * TEST GET DEAL_COUNTERPARTIES
     * 
     */

    @Test
    @DisplayName("getCounterpartiesByDealId: returns all counterparties for a deal")
    void testGetCounterpartiesByDealId() {

        DealCounterparty dcp1 = DealCounterpartyTestFactory.buildDealCounterparty()
            .toBuilder().dealId("deal-1").counterpartyId("cp-1").build();

        DealCounterparty dcp2 = DealCounterpartyTestFactory.buildDealCounterparty()
            .toBuilder().dealId("deal-1").counterpartyId("cp-2").build();

        List<DealCounterparty> mockList = List.of(dcp1, dcp2);

        when(dcpRepository.findByDealId("deal-1")).thenReturn(mockList);

        List<DealCounterpartyResponseDto> result =
            dcpService.getCounterpartiesByDealId("deal-1");

        assertEquals(2, result.size());
        assertTrue(result.stream().anyMatch(r -> r.counterpartyId().equals("cp-1")));
        assertTrue(result.stream().anyMatch(r -> r.counterpartyId().equals("cp-2")));

        verify(dcpRepository).findByDealId("deal-1");
    }

    @Test
    @DisplayName("getDealsByCounterpartyId: returns all deals for a counterparty")
    void testGetDealsByCounterpartyId() {

        DealCounterparty dcp1 = DealCounterpartyTestFactory.buildDealCounterparty()
            .toBuilder().counterpartyId("cp-1").dealId("deal-1").build();

        DealCounterparty dcp2 = DealCounterpartyTestFactory.buildDealCounterparty()
            .toBuilder().counterpartyId("cp-1").dealId("deal-2").build();

        List<DealCounterparty> mockList = List.of(dcp1, dcp2);

        when(dcpRepository.findByCounterpartyId("cp-1")).thenReturn(mockList);

        List<DealCounterpartyResponseDto> result =
            dcpService.getDealsByCounterpartyId("cp-1");

        assertEquals(2, result.size());
        assertTrue(result.stream().anyMatch(r -> r.dealId().equals("deal-1")));
        assertTrue(result.stream().anyMatch(r -> r.dealId().equals("deal-2")));

        verify(dcpRepository).findByCounterpartyId("cp-1");
    }

    @Test
    @DisplayName("getCounterpartiesByDealId: throws exception when no counterparties found")
    void testGetCounterpartiesByDealIdNotFound() {

        when(dcpRepository.findByDealId("deal-1"))
            .thenReturn(List.of());

        assertThrows(DealNotFoundException.class, () ->
            dcpService.getCounterpartiesByDealId("deal-1")
        );

        verify(dcpRepository).findByDealId("deal-1");
    }

    @Test
    @DisplayName("getDealsByCounterpartyId: throws exception when no deals found")
    void testGetDealsByCounterpartyIdNotFound() {

        when(dcpRepository.findByCounterpartyId("cp-1"))
            .thenReturn(List.of());

        assertThrows(CounterpartyNotFoundException.class, () ->
            dcpService.getDealsByCounterpartyId("cp-1")
        );

        verify(dcpRepository).findByCounterpartyId("cp-1");
    }
}
