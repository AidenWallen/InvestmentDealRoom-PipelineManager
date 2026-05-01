package com.skillstorm.investment_deal_room_backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.LinkCounterpartyDealRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.LinkDealCounterpartyRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response.DealCounterpartyResponseDto;
import com.skillstorm.investment_deal_room_backend.services.DealCounterpartyService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/v1")
public class DealCounterpartyController {
    private final DealCounterpartyService dcpService;

    public DealCounterpartyController(DealCounterpartyService dcpService){
        this.dcpService = dcpService;
    }

    @GetMapping("/deals/{dealId}/counterparties")
    public ResponseEntity<List<DealCounterpartyResponseDto>> getCounterpartiesByDealId(@PathVariable String dealId){
        return ResponseEntity.ok(dcpService.getCounterpartiesByDealId(dealId));
    }

    @GetMapping("/counterparties/{counterpartyId}/deals")
    public ResponseEntity<List<DealCounterpartyResponseDto>> getDealsByCounterpartyId(@PathVariable String counterpartyId){
        return ResponseEntity.ok(dcpService.getDealsByCounterpartyId(counterpartyId));
    }

    @PostMapping("/deals/{dealId}/counterparties")
    public ResponseEntity<DealCounterpartyResponseDto> linkDealToCounterparty(
            @PathVariable String dealId,
            @Valid @RequestBody LinkDealCounterpartyRequestDto request
    ) {
        DealCounterpartyResponseDto response = dcpService.linkDealToCounterparty(dealId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/counterparties/{counterpartyId}/deals")
    public ResponseEntity<DealCounterpartyResponseDto> linkCounterpartyToDeal(
            @PathVariable String counterpartyId,
            @Valid @RequestBody LinkCounterpartyDealRequestDto request
    ) {
        DealCounterpartyResponseDto response = dcpService.linkCounterpartyToDeal(counterpartyId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
}
