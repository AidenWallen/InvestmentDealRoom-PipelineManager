package com.skillstorm.investment_deal_room_backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.CreateCounterpartyRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response.CounterpartyResponseDto;
import com.skillstorm.investment_deal_room_backend.services.CounterpartyService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.UpdateCounterpartyRequestDto;



@RestController
@RequestMapping("/api/v1/counterparties")
public class CounterpartyController {

    private final CounterpartyService counterpartyService;

    public CounterpartyController(CounterpartyService counterpartyService){
        this.counterpartyService = counterpartyService;
    }

    @GetMapping
    public ResponseEntity<List<CounterpartyResponseDto>> getAllCounterparties() {
        return ResponseEntity.ok(counterpartyService.getAllCounterparties());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CounterpartyResponseDto> getCounterpartyById(@PathVariable String id) {
        return ResponseEntity.ok(counterpartyService.getCounterpartyById(id));
    }

    @PreAuthorize("hasRole('DEAL_MANAGER')")
    @PostMapping
    public ResponseEntity<CounterpartyResponseDto> createCounterparty(@Valid @RequestBody CreateCounterpartyRequestDto request) {
        CounterpartyResponseDto response = counterpartyService.createCounterparty(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PreAuthorize("hasRole('DEAL_MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<CounterpartyResponseDto> updateCounterparty(@PathVariable String id, @Valid @RequestBody UpdateCounterpartyRequestDto request) {
        return ResponseEntity.ok(counterpartyService.updateCounterparty(id, request));
    }

    @PreAuthorize("hasRole('DEAL_MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCounterparty(@PathVariable String id) {
        counterpartyService.deleteCounterparty(id);
        return ResponseEntity.noContent().build();
    }
}
