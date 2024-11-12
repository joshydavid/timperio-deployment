package com.Timperio.models;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "customer")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Customer {
    @Id
    @Column(name = "customer_id", nullable = false, unique = true)
    private Integer customerId;

    @Column(name = "customer_email", nullable = false)
    private String customerEmail;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PurchaseHistory> purchaseHistory;

    @Column(name = "total_spending", nullable = false)
    private Double totalSpending;

}
