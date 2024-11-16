package com.Timperio.service;

import java.io.PrintWriter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import com.Timperio.dto.PurchaseHistoryDto;
import com.Timperio.dto.PurchaseHistoryExportDto;
import com.Timperio.enums.SalesType;
import com.Timperio.service.impl.PurchaseHistoryExportService;
import com.Timperio.service.impl.PurchaseHistoryService;
import com.opencsv.CSVWriter;

import jakarta.servlet.http.HttpServletResponse;

@Service
public class PurchaseHistoryExportServiceImpl implements PurchaseHistoryExportService {

    @Autowired
    private PurchaseHistoryService purchaseHistoryService;

    @Override
    public void writePurchaseHistoriesToCsv(PurchaseHistoryExportDto requestData, HttpServletResponse response)
            throws Exception {

        Integer customerId = requestData.getCustomerId();
        List<SalesType> salesType = requestData.getSalesType();
        LocalDate startDate = requestData.getStartDate();
        LocalDate endDate = requestData.getEndDate();
        BigDecimal minPrice = requestData.getMinPrice();
        BigDecimal maxPrice = requestData.getMaxPrice();

        List<PurchaseHistoryDto> purchaseHistories = this.purchaseHistoryService
                .findAllFilteredPurchaseHistories(customerId, salesType, startDate, endDate, minPrice, maxPrice);

        response.setContentType("text/csv");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=\"purchase_history.csv\"");
        try (PrintWriter writer = response.getWriter(); CSVWriter csvWriter = new CSVWriter(writer)) {

            String[] header = {"Customer ID", "Sales ID", "Sales Type", "Total Price", "Sales Date"};
            csvWriter.writeNext(header);

            for (PurchaseHistoryDto history : purchaseHistories) {
                String salesTypeSanitised = (history.getSalesType() != null)
                        ? history.getSalesType().toString()
                        : "UNKNOWN";
                String[] data = {String.valueOf(history.getCustomerId()), String.valueOf(history.getSalesId()),
                        salesTypeSanitised, String.valueOf(String.format("%.2f", history.getTotalPrice())),
                        history.getSalesDate().toString()};
                csvWriter.writeNext(data);
            }
        }
    }
}
