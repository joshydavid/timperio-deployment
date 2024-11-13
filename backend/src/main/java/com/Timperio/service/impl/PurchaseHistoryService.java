package com.Timperio.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;

import com.Timperio.dto.PurchaseHistoryDto;
import com.Timperio.enums.ChannelType;
import com.Timperio.enums.SalesType;
import com.Timperio.enums.ShippingMethod;
import com.Timperio.models.Customer;
import com.Timperio.models.PurchaseHistory;

public interface PurchaseHistoryService {
    public List<PurchaseHistory> findAll();

    public PurchaseHistory createPurchaseHistory(Row row, Customer customer);

    public List<PurchaseHistoryDto> findAllFilteredPurchaseHistories(Integer customerId, List<SalesType> salesType,
            LocalDate salesDate, BigDecimal minPrice, BigDecimal maxPrice);

    public List<PurchaseHistory> findByCustomerId(Integer id);

    public List<PurchaseHistory> findBySalesType(List<SalesType> salesType);

    public List<PurchaseHistory> findByChannelType(ChannelType channelType);

    public List<PurchaseHistory> findByShippingMethod(ShippingMethod shippingMethod);

    public int getSalesCount(List<PurchaseHistory> purchaseHistoryList);

    public double getSalesTotal(List<PurchaseHistory> purchaseHistoryList);

    public double getAvgOrderValue(List<PurchaseHistory> purchaseHistoryList);

}
