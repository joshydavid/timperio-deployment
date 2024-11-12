package com.Timperio.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.Timperio.enums.SalesType;

import jakarta.servlet.http.HttpServletResponse;

public interface PurchaseHistoryExportService {
    public void writePurchaseHistoriesToCsv(Integer customerId, SalesType salesType, LocalDate salesDate,
            BigDecimal minPrice, BigDecimal maxPrice,
            HttpServletResponse response)
            throws Exception;
}
