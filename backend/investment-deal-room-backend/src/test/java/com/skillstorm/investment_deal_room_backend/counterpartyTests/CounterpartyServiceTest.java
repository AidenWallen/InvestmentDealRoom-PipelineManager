package com.skillstorm.investment_deal_room_backend.counterpartyTests;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatNoException;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
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

import com.mongodb.DuplicateKeyException;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.CreateCounterpartyRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.UpdateCounterpartyRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response.CounterpartyResponseDto;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.DuplicateResourceExceptions.CounterpartyAlreadyExistsException;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.NotFoundExceptions.CounterpartyNotFoundException;
import com.skillstorm.investment_deal_room_backend.models.Counterparty;
import com.skillstorm.investment_deal_room_backend.repositories.CounterpartyRepository;
import com.skillstorm.investment_deal_room_backend.repositories.DealCounterpartyRepository;
import com.skillstorm.investment_deal_room_backend.services.CounterpartyService;

@ExtendWith(MockitoExtension.class)
public class CounterpartyServiceTest {

    @Mock
    private CounterpartyRepository counterpartyRepository;

    @Mock
    private DealCounterpartyRepository dealCounterpartyRepository;

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

        when(counterpartyRepository.save(any(Counterparty.class)))
                .thenReturn(savedCounterparty);

        CreateCounterpartyRequestDto request = CounterpartyTestFactory.buildCreateRequest();
        CounterpartyResponseDto result = counterpartyService.createCounterparty(request);

        assertEquals(request.organizationName(), result.organizationName());
        assertEquals(request.contactName(), result.contactName());
        assertEquals(request.contactEmail(), result.contactEmail());
        assertEquals(request.contactPhone(), result.contactPhone());

        verify(counterpartyRepository).save(any(Counterparty.class));
    }

    @Test
    @DisplayName("createCounterparty: throws an exception when the counterparty name already exists")
    void testCreateCounterpartyNameExists() {

        CreateCounterpartyRequestDto request = CounterpartyTestFactory.buildCreateRequest();

        when(counterpartyRepository.save(any(Counterparty.class)))
            .thenThrow(DuplicateKeyException.class);

        assertThrows(CounterpartyAlreadyExistsException.class, () -> {
            counterpartyService.createCounterparty(request);
        });

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

        CounterpartyResponseDto result = counterpartyService.getCounterpartyById("cp-123");

        assertEquals("Test Org", result.organizationName());
        verify(counterpartyRepository).findByIdAndDeletedFalse("cp-123");
    }

    @Test
    @DisplayName("getCounterpartyById: throws exception when id not found")
    void testGetCounterpartyByIdNotFound() {
        when(counterpartyRepository.findByIdAndDeletedFalse("cp-999"))
                .thenReturn(Optional.empty());

        assertThrows(CounterpartyNotFoundException.class, () -> counterpartyService.getCounterpartyById("cp-999"));

        verify(counterpartyRepository).findByIdAndDeletedFalse("cp-999");
    }

    /**
     * 
     * TEST UPDATE COUNTERPARTIES
     * 
     */
    
    @Test
    @DisplayName("updateCounterparty: valid request updates and returns CounterpartyResponseDto")
    void updateCounterparty_success() {

        String counterpartyId = "cp-123";

        Counterparty existing = CounterpartyTestFactory.buildCounterparty();
        existing.setId(counterpartyId);

        UpdateCounterpartyRequestDto request =
            new UpdateCounterpartyRequestDto(
                "New Organization Name",
                "New Contact Name",
                "new@email.com",
                "999-999-9999"
            );

        when(counterpartyRepository.findByIdAndDeletedFalse(counterpartyId))
                .thenReturn(Optional.of(existing));

        when(counterpartyRepository.save(any(Counterparty.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CounterpartyResponseDto result =
            counterpartyService.updateCounterparty(counterpartyId, request);

        assertEquals("New Organization Name", result.organizationName());

        verify(counterpartyRepository).save(any(Counterparty.class));
    }

    @Test
    @DisplayName("updateCounterparty: duplicate organization name throws CounterpartyAlreadyExistsException")
    void updateCounterparty_duplicateName_throwsException() {

        String counterpartyId = "cp-123";

        Counterparty existing = CounterpartyTestFactory.buildCounterparty();
        existing.setId(counterpartyId);

        UpdateCounterpartyRequestDto request =
            new UpdateCounterpartyRequestDto(
                "New Organization Name", // duplicate of name already in database
                null,
                null,
                null
            );

        when(counterpartyRepository.findByIdAndDeletedFalse(counterpartyId))
                .thenReturn(Optional.of(existing));

        when(counterpartyRepository.save(any(Counterparty.class)))
            .thenThrow(DuplicateKeyException.class);

        assertThrows(CounterpartyAlreadyExistsException.class, () -> {
            counterpartyService.updateCounterparty(counterpartyId, request);
        });

        verify(counterpartyRepository).save(any());
    }

    @Test
    @DisplayName("updateCounterparty: throws CounterpartyNotFoundException when id not found")
    void updateCounterparty_notFound() {

        String counterpartyId = "cp-123";

        UpdateCounterpartyRequestDto request =
            new UpdateCounterpartyRequestDto(
                "New Organization Name",
                null,
                null,
                null
            );

        when(counterpartyRepository.findByIdAndDeletedFalse(counterpartyId))
                .thenReturn(Optional.empty());

        assertThrows(CounterpartyNotFoundException.class, () -> {
            counterpartyService.updateCounterparty(counterpartyId, request);
        });

        verify(counterpartyRepository, never()).save(any());
    }

    /**
     * 
     * TEST DELETE COUNTERPARTIES
     * 
     */

    @Test
    @DisplayName("deleteCounterparty: existing id is soft deleted without error")
    void deleteCounterparty_existingId_deletesSuccessfully() {

        Counterparty counterparty =
            CounterpartyTestFactory.buildCounterparty();
        counterparty.setId("cp-001");

        when(counterpartyRepository.findByIdAndDeletedFalse("cp-001"))
                .thenReturn(Optional.of(counterparty));

        when(counterpartyRepository.save(any(Counterparty.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        assertThatNoException()
                .isThrownBy(() -> counterpartyService.deleteCounterparty("cp-001"));

        assertThat(counterparty.isDeleted()).isTrue();

        verify(counterpartyRepository).save(counterparty);
        verify(dealCounterpartyRepository).deleteByDealId(counterparty.getId());
    }

    @Test
    @DisplayName("deleteCounterparty: throws when counterparty does not exist")
    void deleteCounterparty_notFound_throwsException() {

        when(counterpartyRepository.findByIdAndDeletedFalse("cp-001"))
                .thenReturn(Optional.empty());

        assertThrows(CounterpartyNotFoundException.class, () ->
                counterpartyService.deleteCounterparty("cp-001"));

        verify(counterpartyRepository, never()).save(any());
    }

}
