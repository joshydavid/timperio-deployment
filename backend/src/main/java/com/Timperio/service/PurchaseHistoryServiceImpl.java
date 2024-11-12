package com.Timperio.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Timperio.dto.PurchaseHistoryDto;
import com.Timperio.enums.ChannelType;
import com.Timperio.enums.SalesType;
import com.Timperio.enums.ShippingMethod;
import com.Timperio.models.PurchaseHistory;
import com.Timperio.repository.PurchaseHistoryRepository;
import com.Timperio.service.impl.PurchaseHistoryService;

@Service
public class PurchaseHistoryServiceImpl implements PurchaseHistoryService {

    @Autowired
    private PurchaseHistoryRepository purchaseHistoryRepository;

    @Override
    public List<PurchaseHistory> findAll() {
        return purchaseHistoryRepository.findAll();
    }

    @Override
    public List<PurchaseHistoryDto> findAllFilteredPurchaseHistories(Integer customerId, SalesType salesType,
            LocalDate salesDate, BigDecimal minPrice, BigDecimal maxPrice) {
        return purchaseHistoryRepository.findAllFilteredPurchaseHistories(customerId, salesType, salesDate, minPrice,
                maxPrice);
    }

    @Override
    public List<PurchaseHistory> findByCustomerId(Integer id) {
        return purchaseHistoryRepository.findByCustomer_CustomerId(id);
    }

    @Override
    public List<PurchaseHistory> findBySalesType(SalesType salesType) {
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
