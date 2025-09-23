package com.example.bankapp.controller;

import com.example.bankapp.dto.request.TransactionRequest;
import com.example.bankapp.dto.request.UpdateTransactionCategoryRequest;
import com.example.bankapp.dto.response.TransactionResponse;
import com.example.bankapp.entity.Category;
import com.example.bankapp.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(@RequestBody TransactionRequest request) {
        return new ResponseEntity<>(transactionService.createTransaction(request), HttpStatus.CREATED);
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<TransactionResponse>> getTransactionsByAccount(@PathVariable Long accountId) {
        return ResponseEntity.ok(transactionService.getTransactionsByAccount(accountId));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<TransactionResponse>> getTransactionsByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(transactionService.getTransactionsByClient(clientId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }
    
    @PatchMapping("/{transactionId}/categorie")
    public ResponseEntity<TransactionResponse> updateTransactionCategory(
            @PathVariable Long transactionId,
            @RequestBody UpdateTransactionCategoryRequest request) {
        
        TransactionResponse updatedTransaction = 
            transactionService.updateTransactionCategory(transactionId, request.getCategorieId());
        
        return ResponseEntity.ok(updatedTransaction);
    }

    @GetMapping("/categorie/{categorieId}")
    public ResponseEntity<List<TransactionResponse>> getTransactionsByCategory(
            @PathVariable Long categorieId) {
        
        return ResponseEntity.ok(transactionService.getTransactionsByCategory(categorieId));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(transactionService.getAllCategories());
    }
}