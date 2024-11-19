package com.Timperio.enums;

public enum Permission {
    ACCESS_AND_FILTER_PURCHASE_HISTORY("ACCESS AND FILTER PURCHASE HISTORY"),
    EXPORT_FILTERED_DATA("EXPORT FILTERED DATA"),
    SEGMENT_CUSTOMERS_BY_SPENDING("SEGMENT CUSTOMERS BY SPENDING"),
    CREATE_AND_SEND_NEWSLETTER("CREATE AND SEND NEWSLETTER"),
    VIEW_SALES_METRICS("VIEW SALES METRICS"),
    FORMAT_NEWSLETTER_TEMPLATE("FORMAT NEWSLETTER TEMPLATE"),
    MANAGE_USER_ACCOUNTS("MANAGE USER ACCOUNTS");

    private final String permission;

    Permission(String permission) {
        this.permission = permission;
    }

    @Override
    public String toString() {
        return permission;
    }
}
