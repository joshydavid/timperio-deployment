package com.Timperio.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.StreamSupport;

import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Timperio.dto.PurchaseHistoryDto;
import com.Timperio.enums.ChannelType;
import com.Timperio.enums.SalesType;
import com.Timperio.enums.ShippingMethod;
import com.Timperio.models.Customer;
import com.Timperio.models.PurchaseHistory;
import com.Timperio.repository.PurchaseHistoryRepository;
import com.Timperio.service.impl.PurchaseHistoryService;

@Service
public class PurchaseHistoryServiceImpl implements PurchaseHistoryService {

    @Autowired
    private PurchaseHistoryRepository purchaseHistoryRepository;

    @Override
    public PurchaseHistory createPurchaseHistory(Row row, Customer customer) {
        PurchaseHistory purchase = new PurchaseHistory();
        purchase.setSalesId((int) row.getCell(0).getNumericCellValue());
        purchase.setSalesDate(row.getCell(1).getLocalDateTimeCellValue().toLocalDate());

        if (row.getCell(2) == null || row.getCell(2).getStringCellValue() == null
                || row.getCell(2).getStringCellValue().trim().isEmpty()) {
            purchase.setSalesType(null);
        } else {
            purchase.setSalesType(SalesType.valueOf(mapSalesType(row.getCell(2).getStringCellValue())));
        }

        if (row.getCell(3) == null || row.getCell(3).getStringCellValue() == null
                || row.getCell(3).getStringCellValue().trim().isEmpty()) {
            purchase.setChannelType(null);
        } else {
            purchase.setChannelType(ChannelType.valueOf(mapChannelType(row.getCell(3).getStringCellValue())));
        }

        purchase.setCustomerId((int) row.getCell(4).getNumericCellValue());
        purchase.setCustomer(customer);

        if (row.getCell(5) != null && row.getCell(5).getCellType() == CellType.NUMERIC) {
            purchase.setZipCode((int) row.getCell(5).getNumericCellValue());
        } else {
            purchase.setZipCode(null);
        }

        purchase.setShippingMethod(ShippingMethod.valueOf(mapShippingMethod(row.getCell(6).getStringCellValue())));
        purchase.setProduct(row.getCell(7).getStringCellValue());
        purchase.setVariant((int) row.getCell(8).getNumericCellValue());
        purchase.setQuantity((int) row.getCell(9).getNumericCellValue());
        purchase.setUnitPrice(row.getCell(10).getNumericCellValue());
        purchase.setTotalPrice(row.getCell(11).getNumericCellValue());

        purchaseHistoryRepository.save(purchase);
        return purchase;
    }

    private String mapSalesType(String value) {
        return switch (value) {
            case "Direct - B2B" -> "DIRECT_B2B";
            case "Direct - B2C" -> "DIRECT_B2C";
            default -> value.toUpperCase().replaceAll(" ", "_");
        };
    }

    private String mapChannelType(String value) {
        return switch (value) {
            case "Online - Website" -> "ONLINE_WEBSITE";
            default -> value.toUpperCase().replaceAll(" ", "_");
        };
    }

    private String mapShippingMethod(String value) {
        return value.toUpperCase().replaceAll(" ", "_");
    }

    @Override
    public List<PurchaseHistory> findAll() {
        return purchaseHistoryRepository.findAll();
    }

    @Override
    public List<PurchaseHistoryDto> findAllFilteredPurchaseHistories(Integer customerId, List<SalesType> salesType,
            LocalDate startDate, LocalDate endDate, BigDecimal minPrice, BigDecimal maxPrice) {
        return purchaseHistoryRepository.findAllFilteredPurchaseHistories(customerId, salesType, startDate, endDate,
                minPrice, maxPrice);
    }

    @Override
    public List<PurchaseHistory> findByCustomerId(Integer id) {
        return purchaseHistoryRepository.findByCustomer_CustomerId(id);
    }

    @Override
    public List<PurchaseHistory> findBySalesType(List<SalesType> salesType) {
        return purchaseHistoryRepository.findBySalesType(salesType);
    }

    @Override
    public List<PurchaseHistory> findByChannelType(ChannelType channelType) {
        return purchaseHistoryRepository.findByChannelType(channelType);
    }

    @Override
    public List<PurchaseHistory> findByShippingMethod(ShippingMethod shippingMethod) {
        return purchaseHistoryRepository.findByShippingMethod(shippingMethod);
    }

    @Override
    public double getSalesTotal(List<PurchaseHistory> purchaseHistoryList) {
        double salesSum = 0.0;
        for (PurchaseHistory purchaseHistory : purchaseHistoryList) {
            salesSum += purchaseHistory.getTotalPrice();
        }
        return salesSum;
    }

    @Override
    public double getAvgOrderValue(List<PurchaseHistory> purchaseHistoryList) {
        double salesSum = 0.0;
        int count = 0;
        for (PurchaseHistory purchaseHistory : purchaseHistoryList) {
            salesSum += purchaseHistory.getTotalPrice();
            count += 1;
        }
        if (count == 0) {
            return 0.0;
        }
        return salesSum / count;
    }

    @Override
    public int getSalesCount(List<PurchaseHistory> purchaseHistoryList) {
        return (int) StreamSupport.stream(purchaseHistoryList.spliterator(), false).count();
    }
}
