package com.Timperio.enums;

public enum Role {
    MARKETING("MARKETING"), SALES("SALES"), ADMIN("ADMIN");

    private final String role;

    Role(String role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return role;
    }
}
