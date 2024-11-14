package com.Timperio.enums;

public enum ErrorMessage {
    NO_CUSTOMER_FOUND("No customer found"),
    UNAUTHORIZED("Unauthorized: You need to authenticate to access this resource."),
    FORBIDDEN("Access Denied: You do not have the required permissions to access this resource."),
    UPDATE_USER_ACCESS_DENIED("You can only update your own account"),
    DELETE_USER_ERROR("An unexpected error occurred while deleting the user."),
    ADMIN_ACCOUNT_UPDATE_ERROR("User is an admin account. You cannot update user details."),
    INVALID_ROLE("Invalid role: "),
    INVALID_USER_ID("Invalid valid userId: "),
    INVALID_USER_EMAIL("Invalid valid userEmail: ");

    private final String errMsg;

    ErrorMessage(String errMsg) {
        this.errMsg = errMsg;
    }

    public String getMessage() {
        return this.errMsg;
    }
}
