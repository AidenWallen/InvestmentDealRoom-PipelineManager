package com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.NotFoundExceptions;

public class DealCounterpartyNotFoundException extends NotFoundException {

    public DealCounterpartyNotFoundException(String dealId, String counterpartyId) {
        super("Link between Deal: '"+dealId+"' and Counterparty: '"+counterpartyId+"' does not exist.");
    }
}
