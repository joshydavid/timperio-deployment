package com.Timperio.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Timperio.dto.PurchaseHistoryDto;
import com.Timperio.enums.ChannelType;
import com.Timperio.enums.SalesType;
import com.Timperio.enums.ShippingMethod;
import com.Timperio.models.PurchaseHistory;
import com.Timperio.service.impl.PurchaseHistoryService;

@RestController
@RequestMapping("/api/v1/purchaseHistory")

public class PurchaseHistoryController {

    @Autowired
    private PurchaseHistoryService purchaseHistoryService;

    @GetMapping()
    public List<PurchaseHistoryDto> getAllSalesData(@RequestParam(required = false) Integer customerId,
            @RequestParam(required = false) List<SalesType> salesType, LocalDate salesDate, BigDecimal minPrice,
            BigDecimal maxPrice) {
        return this.purchaseHistoryService.findAllFilteredPurchaseHistories(customerId,
                salesType, salesDate, minPrice,
                maxPrice);
    }

    @GetMapping("/customerId/{customerId}")
    public List<PurchaseHistory> getCustomerSalesData(@PathVariable Integer customerId) {
        return this.purchaseHistoryService.findByCustomerId(customerId);
    }

    @GetMapping("/salesType/{salesType}")
    public List<PurchaseHistory> getSalesDataByType(@PathVariable String salesType) {
        List<SalesType> salesTypeList = Arrays.stream(salesType.split(","))
                .map(SalesType::valueOf)
                .collect(Collectors.toList());

        return this.purchaseHistoryService.findBySalesType(salesTypeList);
    }

    @GetMapping("/channelType/{channelType}")
    public List<PurchaseHistory> getSalesDataByChannel(@PathVariable ChannelType channelType) {
        return this.purchaseHistoryService.findByChannelType(channelType);
    }

    @GetMapping("/shippingMethod/{shippingMethod}")
    public List<PurchaseHistory> getSalesDataByShipping(@PathVariable ShippingMethod shippingMethod) {
        return this.purchaseHistoryService.findByShippingMethod(shippingMethod);
    }

}
