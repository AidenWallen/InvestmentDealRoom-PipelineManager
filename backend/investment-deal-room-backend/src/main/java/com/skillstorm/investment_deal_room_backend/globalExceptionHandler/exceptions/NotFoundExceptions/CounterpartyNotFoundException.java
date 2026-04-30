package com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.NotFoundExceptions;

public class CounterpartyNotFoundException extends NotFoundException{
    public CounterpartyNotFoundException(String id) {
        super("Deal not found with id: " + id);
    }
}
