package com.Timperio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.Timperio.models.Customer;

public interface CustomerRepository extends CrudRepository<Customer, Integer> {
    List<Customer> findAll();

    Customer findByCustomerId(Integer customerId);

    boolean existsByCustomerId(Integer customerId);

    @Query("SELECT c FROM Customer c ORDER BY c.totalSpending DESC")
    List<Customer> findAllSortedByTotalSpending();

}
