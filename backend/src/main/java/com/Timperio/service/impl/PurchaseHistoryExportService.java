package com.Timperio.service.impl;

import com.Timperio.dto.PurchaseHistoryExportDto;

import jakarta.servlet.http.HttpServletResponse;

public interface PurchaseHistoryExportService {
    public void writePurchaseHistoriesToCsv(PurchaseHistoryExportDto requestData, HttpServletResponse response)
            throws Exception;
}
