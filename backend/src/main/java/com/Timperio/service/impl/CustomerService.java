package com.Timperio.service.impl;

import java.util.List;

import com.Timperio.enums.CustomerSegment;
import com.Timperio.models.Customer;
import com.Timperio.models.Metric;

public interface CustomerService {

    public void populateCustomersFromHistoryPurchases();

    public Iterable<Customer> getAllCustomers();

    public Customer getCustomer(Integer customerId);

    CustomerSegment getCustomerTier(Integer customerId);

    public List<Customer> getCustomerBySegment(CustomerSegment customerSegment);

    public Metric getMetrics();

    public Metric getMetricsByCustomer(Integer customerId);

}
