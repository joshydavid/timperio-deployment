package com.Timperio.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.*;
import java.math.*;

import com.Timperio.service.impl.CustomerService;
import com.Timperio.service.impl.PurchaseHistoryService;
import com.Timperio.service.impl.DataImportService;
import com.Timperio.models.PurchaseHistory;
import com.Timperio.exceptions.CustomerNotFoundException;
import com.Timperio.exceptions.InvalidPurchaseHistoryException;
import com.Timperio.exceptions.InvalidTotalSpendingException;
import com.Timperio.exceptions.DataImportException;
import com.Timperio.models.Customer;

@Service
public class DataImportServiceImpl implements DataImportService {

    @Autowired
    public CustomerService customerService;

    @Autowired
    private PurchaseHistoryService purchaseHistoryService; 

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void importData(String filePath) {
        try (FileInputStream fis = new FileInputStream(filePath);
             Workbook workbook = new XSSFWorkbook(fis)) {

            Sheet sheet = workbook.getSheet("Sales by product");
            
            loadCustomers(sheet);
            List<PurchaseHistory> purchaseHistoryList = loadPurchaseHistory(sheet);

            Map<Integer, Map<String, Object>> customerDetailsMap = reformatCustomerDetails(purchaseHistoryList);

            customerDetailsMap.forEach((customerId, customerDetails) -> {
                Customer customer = customerService.getCustomer(customerId);

                if (customer == null) {
                    throw new CustomerNotFoundException(customerId + "Customer not found.");
                }

                Object purchaseHistoryOfCustomer = customerDetails.get("purchaseHistory");
                Object totalSpendingOfCustomer = customerDetails.get("totalSpending");

                if (purchaseHistoryOfCustomer instanceof List) {
                    List<PurchaseHistory> purchaseHistoryOfCustomerList = (List<PurchaseHistory>) purchaseHistoryOfCustomer;
                    customer.setPurchaseHistory(purchaseHistoryOfCustomerList);
                } else {
                    throw new InvalidPurchaseHistoryException("Expected purchase history to be a List<PurchaseHistory>, but got: " + purchaseHistoryOfCustomer.getClass().getName());
                }
            
                if (totalSpendingOfCustomer instanceof Double) {
                    Double totalSpending = (Double) totalSpendingOfCustomer;
                    BigDecimal roundedSpending = new BigDecimal(totalSpending).setScale(2, RoundingMode.HALF_UP);
                    customer.setTotalSpending(roundedSpending.doubleValue());
                } else {
                    throw new InvalidTotalSpendingException("Expected total spending to be a Double, but got: " + totalSpendingOfCustomer.getClass().getName());
                }

                entityManager.merge(customer);
            });

        } catch (IOException e) {
            throw new DataImportException("Failed to read the Excel file: " + e.getMessage(), e);
        } catch (CustomerNotFoundException | InvalidPurchaseHistoryException | InvalidTotalSpendingException e) {
            throw new DataImportException("Error processing customer data: " + e.getMessage(), e);
        }
    }

    private static Map<Integer, Map<String, Object>> reformatCustomerDetails(List<PurchaseHistory> purchaseHistoryList) {
        Map<Integer, List<PurchaseHistory>> purchaseHistoryMap = new HashMap<>();
        Map<Integer, Double> totalSpendingMap = new HashMap<>();

        for (PurchaseHistory purchase : purchaseHistoryList) {
            int customerId = purchase.getCustomerId();
            double amountSpent = purchase.getTotalPrice();

            purchaseHistoryMap.computeIfAbsent(customerId, k -> new ArrayList<>()).add(purchase);
            totalSpendingMap.put(customerId, totalSpendingMap.getOrDefault(customerId, 0.0) + amountSpent);
        }

        Map<Integer, Map<String, Object>> customerDetailsMap = new HashMap<>();

        for (Integer customerId : purchaseHistoryMap.keySet()) {
            Map<String, Object> customerDetails = new HashMap<>();
            customerDetails.put("purchaseHistory", purchaseHistoryMap.get(customerId));
            customerDetails.put("totalSpending", totalSpendingMap.getOrDefault(customerId, 0.0));

            customerDetailsMap.put(customerId, customerDetails);
        }

        return customerDetailsMap;
    }

    private List<PurchaseHistory> loadPurchaseHistory(Sheet sheet) {
        Iterator<Row> rowIterator = sheet.iterator();
        List<PurchaseHistory> purchaseHistoryList = new ArrayList<>();

        if (rowIterator.hasNext()) {
            rowIterator.next();
        }

        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            int customerId = (int) row.getCell(4).getNumericCellValue();
            Customer customer = customerService.getCustomer(customerId);

            PurchaseHistory ph = purchaseHistoryService.createPurchaseHistory(row, customer);
            purchaseHistoryList.add(ph);
        }

        return purchaseHistoryList;

    }

    private void loadCustomers(Sheet sheet) {
        Iterator<Row> rowIterator = sheet.iterator();

        if (rowIterator.hasNext()) {
            rowIterator.next();
        }

        Set<Integer> uniqueCustomerIDs = new HashSet<>();

        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            int customerId = (int) row.getCell(4).getNumericCellValue();
            uniqueCustomerIDs.add(customerId);
        }

        for (int id: uniqueCustomerIDs) {
            customerService.createCustomer(id);
        }

    }
}

