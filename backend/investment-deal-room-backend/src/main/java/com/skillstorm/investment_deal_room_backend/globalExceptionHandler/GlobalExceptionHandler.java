package com.skillstorm.investment_deal_room_backend.globalExceptionHandler;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.DealNotFoundException;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.InvalidStageTransitionException;


@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(DealNotFoundException.class)
    public ResponseEntity<String> handleEntityNotFoundException(DealNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    } 

    
    @ExceptionHandler(InvalidStageTransitionException.class)
    public ResponseEntity<String> handleInvalidStageTransitionException(InvalidStageTransitionException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + ex.getMessage());
    }

}