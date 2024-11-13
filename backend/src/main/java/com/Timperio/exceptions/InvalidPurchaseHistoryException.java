package com.Timperio.exceptions;

public class InvalidPurchaseHistoryException extends RuntimeException {
    public InvalidPurchaseHistoryException(String message) {
        super(message);
    }
}