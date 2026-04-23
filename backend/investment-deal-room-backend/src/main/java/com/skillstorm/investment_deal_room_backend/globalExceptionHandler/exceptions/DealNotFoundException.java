package com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions;

public class DealNotFoundException extends RuntimeException {
    public DealNotFoundException(String id) {
        super("Deal not found with id: " + id);
    }
}
