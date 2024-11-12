package com.Timperio.controller;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Timperio.enums.SalesType;
import com.Timperio.service.impl.PurchaseHistoryExportService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/v1/export")
public class CsvController {
    @Autowired
    private PurchaseHistoryExportService purchaseHistoryExportService;

    @GetMapping
    public void exportPurchaseHistoryToCsv(@RequestParam(required = false) Integer customerId,
            @RequestParam(required = false) SalesType salesType,
            @RequestParam(required = false) LocalDate salesDate,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            HttpServletResponse response) throws Exception {
        this.purchaseHistoryExportService.writePurchaseHistoriesToCsv(customerId, salesType, salesDate,
                minPrice, maxPrice, response);
    }

}
