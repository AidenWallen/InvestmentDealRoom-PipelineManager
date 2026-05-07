package com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.DuplicateResourceExceptions;

public class DealAlreadyExistsException extends DuplicateResourceException {

    public DealAlreadyExistsException(String dealName) {
        super("Deal name '" + dealName + "' already exists.");
    }
}
