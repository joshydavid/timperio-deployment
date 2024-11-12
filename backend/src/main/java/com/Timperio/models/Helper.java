package com.Timperio.models;

public class Helper {
    public static double formatToTwoDecimalPlaces(double value) {
        return Double.parseDouble(String.format("%.2f", value));
    }
}
