package com.Timperio.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.Timperio.enums.*;
import com.Timperio.service.impl.DataImportService;
import com.Timperio.exceptions.DataImportException;


@RestController
@RequestMapping("/api/v1/import-data")
public class DataImportController {

    @Autowired
    private DataImportService dataImportService;

    @PostMapping()
    public ResponseEntity<String> importSalesData() {
        try {
            dataImportService.importData("./src/main/resources/db/migration/sales_data.xlsx");
            return ResponseEntity.ok(SuccessMessage.SALES_CUSTOMER_DB_POPULATED.toString());
        } catch (DataImportException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Data import failed: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }
}
