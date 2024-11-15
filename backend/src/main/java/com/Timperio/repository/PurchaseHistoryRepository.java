package com.Timperio.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Timperio.dto.PurchaseHistoryDto;
import com.Timperio.enums.ChannelType;
import com.Timperio.enums.SalesType;
import com.Timperio.enums.ShippingMethod;
import com.Timperio.models.PurchaseHistory;

@Repository
public interface PurchaseHistoryRepository extends CrudRepository<PurchaseHistory, Integer> {

    List<PurchaseHistory> findAll();

    @Query("SELECT new com.Timperio.dto.PurchaseHistoryDto(p.customerId, p.salesId, p.product, p.salesType, p.totalPrice, p.salesDate, p.quantity) "
            + "FROM PurchaseHistory p " + "WHERE (:customerId IS NULL OR p.customerId = :#{#customerId}) "
            + "AND (:salesType IS NULL OR p.salesType IN :#{#salesType})"
            + "AND (TRUE = :#{#startDate == null} OR TRUE = :#{#endDate == null} OR p.salesDate BETWEEN :#{#startDate} AND :#{#endDate})"
            + "AND (:minPrice IS NULL OR p.totalPrice >= :#{#minPrice})"
            + "AND (:maxPrice IS NULL OR p.totalPrice <= :#{#maxPrice})")
    List<PurchaseHistoryDto> findAllFilteredPurchaseHistories(@Param("customerId") Integer customerId,
            @Param("salesType") List<SalesType> salesType, @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate, @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice);

    List<PurchaseHistory> findByCustomer_CustomerId(Integer customerId);

    @Query("SELECT p FROM PurchaseHistory p WHERE p.salesType IN :salesType")
    List<PurchaseHistory> findBySalesType(@Param("salesType") List<SalesType> salesType);

    List<PurchaseHistory> findByChannelType(ChannelType channelType);

    List<PurchaseHistory> findByShippingMethod(ShippingMethod shippingMethod);
}
