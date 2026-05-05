package com.skillstorm.investment_deal_room_backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.investment_deal_room_backend.services.DealService;

import jakarta.validation.Valid;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.CreateDealRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.UpdateDealRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.UpdatePipelineStageRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response.DealResponseDto;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/v1/deals")
public class DealController {
    private final DealService dealService;
 
    public DealController(DealService dealService) {
        this.dealService = dealService;
    }

    
    @GetMapping
    public ResponseEntity<List<DealResponseDto>> getAllDeals() {
        return ResponseEntity.ok(dealService.getAllDeals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DealResponseDto> getDealById(@PathVariable String id) {
        return ResponseEntity.ok(dealService.getDealById(id));
    }


    @PreAuthorize("hasRole('DEAL_MANAGER')")
    @PostMapping
    public ResponseEntity<DealResponseDto> createDeal(@Valid @RequestBody CreateDealRequestDto request, @RequestParam String userId) {
        DealResponseDto response = dealService.createDeal(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    

    @PreAuthorize("hasRole('DEAL_MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<DealResponseDto> updateDeal(@PathVariable String id, @Valid @RequestBody UpdateDealRequestDto request) {
        return ResponseEntity.ok(dealService.updateDeal(id, request));
    }


    @PreAuthorize("hasRole('DEAL_MANAGER')")
    @PatchMapping("/{id}/stage")
    public ResponseEntity<DealResponseDto> updatePipelineStage(@PathVariable String id, @RequestBody UpdatePipelineStageRequestDto request) {
        return ResponseEntity.ok(dealService.updatePipelineStage(id, request.pipelineStage()));
    }

    @PreAuthorize("hasRole('DEAL_MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeal(@PathVariable String id) {
        dealService.deleteDeal(id);
        return ResponseEntity.noContent().build();
    }

}
