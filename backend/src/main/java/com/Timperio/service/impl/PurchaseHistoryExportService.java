package com.Timperio.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.Timperio.enums.SalesType;

import jakarta.servlet.http.HttpServletResponse;

public interface PurchaseHistoryExportService {
    public void writePurchaseHistoriesToCsv(Integer customerId, List<SalesType> salesType, LocalDate startDate,
            LocalDate endDate,
            BigDecimal minPrice, BigDecimal maxPrice,
            HttpServletResponse response)
            throws Exception;
}
