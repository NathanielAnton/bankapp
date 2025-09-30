package com.example.bankapp.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionRequest {
    private Long accountId;
    private Long destinataireAccountId; // Pour les virements
    private String type;
    private BigDecimal montant;
    private String description;
    private Long categorieId;
    private LocalDateTime dateTransaction; 

    // Getters et Setters
    public Long getAccountId() { return accountId; }
    public void setAccountId(Long accountId) { this.accountId = accountId; }
    
    public Long getDestinataireAccountId() { return destinataireAccountId; }
    public void setDestinataireAccountId(Long destinataireAccountId) { this.destinataireAccountId = destinataireAccountId; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public BigDecimal getMontant() { return montant; }
    public void setMontant(BigDecimal montant) { this.montant = montant; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Long getCategorieId() { return categorieId; }
    public void setCategorieId(Long categorieId) { this.categorieId = categorieId; }
    
    public LocalDateTime getDateTransaction() { return dateTransaction;}
    public void setDateTransaction() { this.dateTransaction = dateTransaction; }
    
}