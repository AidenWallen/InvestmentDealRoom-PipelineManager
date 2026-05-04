package com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.NotFoundExceptions;

public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
}