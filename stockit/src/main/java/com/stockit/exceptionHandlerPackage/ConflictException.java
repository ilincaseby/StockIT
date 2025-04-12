package com.stockit.exceptionHandlerPackage;

public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
