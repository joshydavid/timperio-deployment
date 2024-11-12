package com.Timperio.exceptions;

public class InvalidRoleException extends IllegalArgumentException {
    public InvalidRoleException(String message) {
        super(message);
    }
}