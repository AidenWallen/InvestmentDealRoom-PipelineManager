package com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.NotFoundExceptions;

public class UserNotFoundException extends NotFoundException {
    public UserNotFoundException(String azureId) {
        super("User not found with id: " + azureId);
    }
}
