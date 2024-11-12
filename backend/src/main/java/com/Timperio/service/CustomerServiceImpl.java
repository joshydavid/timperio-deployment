package com.Timperio.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Timperio.constant.CustomerConstant;
import com.Timperio.enums.CustomerSegment;
import com.Timperio.models.Customer;
import com.Timperio.models.Helper;
import com.Timperio.models.Metric;
import com.Timperio.models.PurchaseHistory;
import com.Timperio.repository.CustomerRepository;
import com.Timperio.service.impl.CustomerService;
import com.Timperio.service.impl.PurchaseHistoryService;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;;

@Service
public class CustomerServiceImpl implements CustomerService {
    @Autowired
    public PurchaseHistoryService purchaseHistoryService;

    @Autowired
    public CustomerRepository customerRepository;

    @Autowired
    private EntityManager entityManager;

    @Transactional
    public void populateCustomersFromHistoryPurchases() {
        List<PurchaseHistory> purchaseHistories = this.purchaseHistoryService.findAll();

        for (PurchaseHistory purchaseHistory : purchaseHistories) {
            Customer customer = purchaseHistory.getCustomer();
            Integer customerId = customer.getCustomerId();
            List<PurchaseHistory> specificCustomerPurchaseHistory = this.purchaseHistoryService
                    .findByCustomerId(customerId);

            String customerEmail = String.format("jane_doe_%d@yopmail.com", customerId);
            Double totalSpendingByCustomer = this.purchaseHistoryService.getSalesTotal(specificCustomerPurchaseHistory);

            if (!customerRepository.existsByCustomerId(customerId)) {
                Customer newCustomer = new Customer();
                newCustomer.setCustomerId(customerId);
                newCustomer.setCustomerEmail(customerEmail);
                newCustomer.setTotalSpending(totalSpendingByCustomer);

                String sql = "INSERT INTO customer (customer_id, customer_email, total_spending) " +
                        "VALUES (:customerId, :email, :totalSpending)";

                entityManager.createNativeQuery(sql)
                        .setParameter("customerId", customerId)
                        .setParameter("email", customerEmail)
                        .setParameter("totalSpending", totalSpendingByCustomer)
                        .executeUpdate();
            }
        }
    }

    @Override
    public List<Customer> getAllCustomers() {
        List<Customer> customers = this.customerRepository.findAll();
        return customers;
    }

    @Override
    public Customer getCustomer(Integer customerId) {
        Customer customer = this.customerRepository.findByCustomerId(customerId);
        return customer;
    }

    private Map<CustomerSegment, Integer> calculateSegmentThresholds(List<Customer> customers) {
        int totalCustomers = customers.size();
        int highValueEndIndex = (int) Math.ceil(totalCustomers * CustomerConstant.HIGH_VALUE_THRESHOLD);
        int midTierEndIndex = (int) Math.floor(totalCustomers * CustomerConstant.MID_TIER_THRESHOLD);

        midTierEndIndex = Math.min(midTierEndIndex, totalCustomers);

        Map<CustomerSegment, Integer> thresholds = new HashMap<>();
        thresholds.put(CustomerSegment.HIGH_VALUE, highValueEndIndex);
        thresholds.put(CustomerSegment.MID_TIER, midTierEndIndex);

        return thresholds;
    }

    @Override
    public CustomerSegment getCustomerTier(Integer customerId) {
        Customer customer = this.getCustomer(customerId);
        double totalSpending = customer.getTotalSpending();

        List<Customer> customers = this.customerRepository.findAllSortedByTotalSpending();
        Map<CustomerSegment, Integer> thresholds = calculateSegmentThresholds(customers);

        if (totalSpending >= customers.get(thresholds.get(CustomerSegment.HIGH_VALUE) - 1).getTotalSpending()) {
            return CustomerSegment.HIGH_VALUE;
        } else if (totalSpending >= customers.get(thresholds.get(CustomerSegment.MID_TIER) - 1).getTotalSpending()) {
            return CustomerSegment.MID_TIER;
        } else {
            return CustomerSegment.LOW_SPEND;
        }
    }

    @Override
    public List<Customer> getCustomerBySegment(CustomerSegment customerSegment) {
        List<Customer> customers = this.customerRepository.findAllSortedByTotalSpending();
        Integer totalCustomers = customers.size();
        Map<CustomerSegment, Integer> thresholds = calculateSegmentThresholds(customers);

        switch (customerSegment) {
            case HIGH_VALUE:
                return customers.subList(0, thresholds.get(CustomerSegment.HIGH_VALUE));
            case MID_TIER:
                return customers.subList(thresholds.get(CustomerSegment.HIGH_VALUE),
                        thresholds.get(CustomerSegment.MID_TIER));
            case LOW_SPEND:
                return customers.subList(thresholds.get(CustomerSegment.MID_TIER), totalCustomers);
            default:
                return customers;
        }
    }

    @Override
    public Metric getMetrics() {
        List<PurchaseHistory> purchaseHistories = this.purchaseHistoryService.findAll();
        double totalSalesAmount = this.purchaseHistoryService.getSalesTotal(purchaseHistories);
        int totalSalesCount = this.purchaseHistoryService.getSalesCount(purchaseHistories);
        double totalAverageSales = this.purchaseHistoryService.getAvgOrderValue(purchaseHistories);

        Metric metric = new Metric(Helper.formatToTwoDecimalPlaces(totalSalesAmount), totalSalesCount,
                Helper.formatToTwoDecimalPlaces(totalAverageSales));

        return metric;
    }

    @Override
    public Metric getMetricsByCustomer(Integer customerId) {
        List<PurchaseHistory> specificCustomerPurchaseHistory = this.purchaseHistoryService
                .findByCustomerId(customerId);

        double totalSalesAmount = this.purchaseHistoryService.getSalesTotal(specificCustomerPurchaseHistory);
        int totalSalesCount = this.purchaseHistoryService.getSalesCount(specificCustomerPurchaseHistory);
        double totalAverageSales = this.purchaseHistoryService.getAvgOrderValue(specificCustomerPurchaseHistory);

        Metric metric = new Metric(Helper.formatToTwoDecimalPlaces(totalSalesAmount), totalSalesCount,
                Helper.formatToTwoDecimalPlaces(totalAverageSales));

        return metric;
    }

}
