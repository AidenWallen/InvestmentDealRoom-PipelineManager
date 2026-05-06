package com.skillstorm.investment_deal_room_backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.LinkCounterpartyDealRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.LinkDealCounterpartyRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response.DealCounterpartyResponseDto;
import com.skillstorm.investment_deal_room_backend.services.DealCounterpartyService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
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

    @PreAuthorize("hasRole('DEAL_MANAGER')")
    @PostMapping("/deals/{dealId}/counterparties")
    public ResponseEntity<DealCounterpartyResponseDto> linkDealToCounterparty(
            @PathVariable String dealId,
            @Valid @RequestBody LinkDealCounterpartyRequestDto request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        DealCounterpartyResponseDto response = dcpService.linkDealToCounterparty(dealId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PreAuthorize("hasRole('DEAL_MANAGER')")
    @PostMapping("/counterparties/{counterpartyId}/deals")
    public ResponseEntity<DealCounterpartyResponseDto> linkCounterpartyToDeal(
            @PathVariable String counterpartyId,
            @Valid @RequestBody LinkCounterpartyDealRequestDto request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        DealCounterpartyResponseDto response = dcpService.linkCounterpartyToDeal(counterpartyId, request, jwt.getClaimAsString("name"));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PreAuthorize("hasRole('DEAL_MANAGER')")
    @DeleteMapping("/counterparties/{counterpartyId}/deals/{dealId}")
    public ResponseEntity<Void> unlinkCounterpartyFromDeal(
            @PathVariable String counterpartyId,
            @PathVariable String dealId
    ) {
        dcpService.unlinkDealCounterparty(dealId, counterpartyId);
        return ResponseEntity.noContent().build();
    }

}
