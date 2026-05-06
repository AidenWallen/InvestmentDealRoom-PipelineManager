package com.skillstorm.investment_deal_room_backend.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skillstorm.investment_deal_room_backend.dtos.userDtos.response.UserResponseDto;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.NotFoundExceptions.UserNotFoundException;
import com.skillstorm.investment_deal_room_backend.models.User;
import com.skillstorm.investment_deal_room_backend.repositories.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponseDto getDepartment(String azureId) {
        User user = userRepository.findById(azureId)
            .orElseThrow(() -> new UserNotFoundException(azureId));
        return UserResponseDto.fromEntity(user);
    }

    @Transactional
    public UserResponseDto upsertDepartment(String azureId, String department) {
        User user = userRepository.findById(azureId)
            .orElse(User.builder().azureId(azureId).build());
        user.setDepartment(department);
        return UserResponseDto.fromEntity(userRepository.save(user));
    }
}
