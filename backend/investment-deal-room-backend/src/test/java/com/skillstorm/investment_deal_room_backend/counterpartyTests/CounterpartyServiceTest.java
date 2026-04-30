package com.skillstorm.investment_deal_room_backend.counterpartyTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.CreateCounterpartyRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response.CounterpartyResponseDto;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.NotFoundExceptions.CounterpartyNotFoundException;
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
        CreateCounterpartyRequestDto requestDto = CounterpartyTestFactory.buildCreateRequest();
        Counterparty savedCounterparty = CounterpartyTestFactory.buildCounterparty();

        when(counterpartyRepository.save(any(Counterparty.class)))
            .thenReturn(savedCounterparty);

        CounterpartyResponseDto result = counterpartyService.createCounterparty(requestDto);

        assertEquals(requestDto.organizationName(), result.organizationName());
        assertEquals(requestDto.primaryContactName(), result.primaryContactName());
        assertEquals(requestDto.contactEmail(), result.contactEmail());
        assertEquals(requestDto.contactPhone(), result.contactPhone());

        verify(counterpartyRepository).save(any(Counterparty.class));
    }

    /**
     * 
     * TEST GET COUNTERPARTIES
     * 
     */

    @Test
    @DisplayName("getAllCounterparties: returns all counterparties")
    void testGetAllCounterparties() {

        Counterparty cp1 = CounterpartyTestFactory.buildCounterparty()
            .toBuilder().id("cp-1").organizationName("Org 1").build();

        Counterparty cp2 = CounterpartyTestFactory.buildCounterparty()
            .toBuilder().id("cp-2").organizationName("Org 2").build();

        List<Counterparty> mockList = List.of(cp1, cp2);

        when(counterpartyRepository.findByDeletedFalse()).thenReturn(mockList);

        List<CounterpartyResponseDto> result = counterpartyService.getAllCounterparties();

        assertEquals(2, result.size());
        assertEquals("Org 1", result.get(0).organizationName());
        assertEquals("Org 2", result.get(1).organizationName());

        verify(counterpartyRepository).findByDeletedFalse();
    }

    @Test
    @DisplayName("getCounterpartyById: returns counterparty when id exists")
    void testGetCounterpartyById() {
        Counterparty cp = CounterpartyTestFactory.buildCounterparty()
            .toBuilder()
            .id("cp-123")
            .organizationName("Test Org")
            .build();

        when(counterpartyRepository.findByIdAndDeletedFalse("cp-123"))
            .thenReturn(Optional.of(cp));

        CounterpartyResponseDto result =
            counterpartyService.getCounterpartyById("cp-123");

        assertEquals("Test Org", result.organizationName());
        verify(counterpartyRepository).findByIdAndDeletedFalse("cp-123");
    }

    @Test
    @DisplayName("getCounterpartyById: throws exception when id not found")
    void testGetCounterpartyByIdNotFound() {
        when(counterpartyRepository.findByIdAndDeletedFalse("cp-999"))
            .thenReturn(Optional.empty());

        assertThrows(CounterpartyNotFoundException.class, () ->
            counterpartyService.getCounterpartyById("cp-999")
        );

        verify(counterpartyRepository).findByIdAndDeletedFalse("cp-999");
    }

}
