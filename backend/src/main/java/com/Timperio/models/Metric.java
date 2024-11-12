package com.Timperio.models;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class Metric {
    private double totalSalesAmount;
    private Integer totalSalesCount;
    private double totalAverageSales;
}
