package com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.DuplicateResourceExceptions;

public class DealCounterpartyAlreadyExistsException extends DuplicateResourceException {

    public DealCounterpartyAlreadyExistsException(String dealName, String counterpartyName) {
        super("Link between Deal: '"+dealName+"' and Counterparty: '"+counterpartyName+"' already exists.");
    }
}
