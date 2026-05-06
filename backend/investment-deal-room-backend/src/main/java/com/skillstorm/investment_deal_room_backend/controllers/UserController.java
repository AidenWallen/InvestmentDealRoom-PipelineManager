package com.skillstorm.investment_deal_room_backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.investment_deal_room_backend.dtos.userDtos.request.UpdateDepartmentRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.userDtos.response.UserResponseDto;
import com.skillstorm.investment_deal_room_backend.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{azureId}/department")
    public ResponseEntity<UserResponseDto> getDepartment(@PathVariable String azureId) {
        return ResponseEntity.ok(userService.getDepartment(azureId));
    }

    @PatchMapping("/{azureId}/department")
    public ResponseEntity<UserResponseDto> updateDepartment(
            @PathVariable String azureId,
            @Valid @RequestBody UpdateDepartmentRequestDto request) {
        return ResponseEntity.ok(userService.upsertDepartment(azureId, request.department()));
    }
}
