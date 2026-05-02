package com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.DuplicateResourceExceptions;

public class CounterpartyAlreadyExistsException extends DuplicateResourceException {

    public CounterpartyAlreadyExistsException(String organizationName) {
        super("Counterparty organization name '"+organizationName+"' already exists.");
    }
}
