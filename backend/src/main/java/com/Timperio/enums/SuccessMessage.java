package com.Timperio.enums;

public enum SuccessMessage {
    CUSTOMER_DB_POPULATED("CUSTOMER_DB_POPULATED"),
    USER_DELETED_SUCCESS("User deleted successfully");

    private final String successMsg;

    SuccessMessage(String successMsg) {
        this.successMsg = successMsg;
    }

    @Override
    public String toString() {
        return successMsg;
    }
}
