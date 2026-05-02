package com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.DuplicateResourceExceptions;

public class DealCounterpartyAlreadyExistsException extends DuplicateResourceException {

    public DealCounterpartyAlreadyExistsException(String dealId, String counterpartyId) {
        super("Link between Deal: '"+dealId+"' and Counterparty: '"+counterpartyId+"' already exists.");
    }
}
