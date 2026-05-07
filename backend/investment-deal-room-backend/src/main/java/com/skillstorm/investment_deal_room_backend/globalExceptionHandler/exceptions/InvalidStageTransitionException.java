package com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions;

public class InvalidStageTransitionException extends RuntimeException {
    public InvalidStageTransitionException(String message) {
        super(message);
    }
}
