package com.skillstorm.investment_deal_room_backend.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response.DealActivityResponseDto;
import com.skillstorm.investment_deal_room_backend.services.DealActivityService;

@RestController
@RequestMapping("/api/v1/deals/{dealId}/activity")
public class DealActivityController {
    private final DealActivityService dealActivityService;

    public DealActivityController(DealActivityService dealActivityService) {
        this.dealActivityService = dealActivityService;
    }

    @GetMapping
    public ResponseEntity<List<DealActivityResponseDto>> getDealActivity(@PathVariable String dealId) {
        return ResponseEntity.ok(dealActivityService.getActivitiesFeed(dealId));
    }
    
}
