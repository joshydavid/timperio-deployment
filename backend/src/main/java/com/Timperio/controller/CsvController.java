package com.Timperio.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Timperio.constant.UrlConstant;
import com.Timperio.dto.PurchaseHistoryExportDto;
import com.Timperio.enums.SalesType;
import com.Timperio.service.impl.PurchaseHistoryExportService;

import jakarta.servlet.http.HttpServletResponse;

@RequestMapping(UrlConstant.API_VERSION + "/export")
@RestController

public class CsvController {
    @Autowired
    private PurchaseHistoryExportService purchaseHistoryExportService;

    @GetMapping
    public void exportPurchaseHistoryToCsv(@RequestParam(required = false) Integer customerId,
            @RequestParam(required = false) String salesType, @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate, @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice, HttpServletResponse response) throws Exception {

        List<SalesType> salesTypeList = (salesType != null && !salesType.isEmpty())
                ? Arrays.stream(salesType.split(",")).map(SalesType::valueOf).collect(Collectors.toList())
                : null;

        PurchaseHistoryExportDto requestData = new PurchaseHistoryExportDto();
        requestData.setCustomerId(customerId);
        requestData.setSalesType(salesTypeList);
        requestData.setMinPrice(minPrice);
        requestData.setMaxPrice(maxPrice);

        this.purchaseHistoryExportService.writePurchaseHistoriesToCsv(requestData, response);
    }

}
