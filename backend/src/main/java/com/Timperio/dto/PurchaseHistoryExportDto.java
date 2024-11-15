package com.Timperio.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.Timperio.enums.SalesType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class PurchaseHistoryExportDto {
    private Integer customerId;
    private List<SalesType> salesType;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
}
