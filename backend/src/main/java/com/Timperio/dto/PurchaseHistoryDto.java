package com.Timperio.dto;

import java.time.LocalDate;

import com.Timperio.enums.SalesType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class PurchaseHistoryDto {
    private Integer customerId;
    private Integer salesId;
    private String product;
    private SalesType salesType;
    private Double totalPrice;
    private LocalDate salesDate;
    private Integer quantity;
}
