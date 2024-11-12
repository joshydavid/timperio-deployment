package com.Timperio.enums;

public enum CustomerSegment {
    LOW_SPEND("LOW_SPEND"),
    MID_TIER("MID_TIER"),
    HIGH_VALUE("HIGH_VALUE");

    private final String segment;

    CustomerSegment(String segment) {
        this.segment = segment;
    }

    @Override
    public String toString() {
        return segment;
    }
}
