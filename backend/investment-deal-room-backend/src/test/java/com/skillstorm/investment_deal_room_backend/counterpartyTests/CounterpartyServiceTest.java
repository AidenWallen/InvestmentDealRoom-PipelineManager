package com.skillstorm.investment_deal_room_backend.counterpartyTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.CreateCounterpartyRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response.CounterpartyResponseDto;
import com.skillstorm.investment_deal_room_backend.models.Counterparty;
import com.skillstorm.investment_deal_room_backend.repositories.CounterpartyRepository;
import com.skillstorm.investment_deal_room_backend.services.CounterpartyService;

@ExtendWith(MockitoExtension.class)
public class CounterpartyServiceTest {

    @Mock
    private CounterpartyRepository counterpartyRepository;

    @InjectMocks
    private CounterpartyService counterpartyService;

    /**
     * 
     * TEST CREATE COUNTERPARTY
     * 
     */

    @Test
    @DisplayName("createCounterparty: valid request should create and return a counterparty")
    void testCreateCounterparty() {
        Counterparty savedCounterparty = CounterpartyTestFactory.buildCounterparty();
        CreateCounterpartyRequestDto requestDto = CounterpartyTestFactory.buildCreateCounterpartyRequestDto(savedCounterparty);

        when(counterpartyRepository.save(any(Counterparty.class)))
            .thenReturn(savedCounterparty);

        CounterpartyResponseDto result = counterpartyService.createCounterparty(requestDto);

        assertEquals("Test Organization Name", result.organizationName());
        assertEquals("Test Contact Name", result.primaryContactName());
        assertEquals("Test Contact Email", result.contactEmail());
        assertEquals("Test Contact Phone", result.contactPhone());

        verify(counterpartyRepository).save(any(Counterparty.class));
    }
}
