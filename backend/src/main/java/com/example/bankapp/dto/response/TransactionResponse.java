package com.example.bankapp.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionResponse {
    private Long id;
    private Long accountId;
    private Long destinataireAccountId;
    private String type;
    private String typeLibelle;
    private BigDecimal montant;
    private LocalDateTime dateTransaction;
    private String description;
    private String categorieLibelle;
    private Long categorieId;

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getAccountId() { return accountId; }
    public void setAccountId(Long accountId) { this.accountId = accountId; }
    
    public Long getDestinataireAccountId() { return destinataireAccountId; }
    public void setDestinataireAccountId(Long destinataireAccountId) { this.destinataireAccountId = destinataireAccountId; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getTypeLibelle() { return typeLibelle; }
    public void setTypeLibelle(String typeLibelle) { this.typeLibelle = typeLibelle; }
    
    public BigDecimal getMontant() { return montant; }
    public void setMontant(BigDecimal montant) { this.montant = montant; }
    
    public LocalDateTime getDateTransaction() { return dateTransaction; }
    public void setDateTransaction(LocalDateTime dateTransaction) { this.dateTransaction = dateTransaction; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getCategorieLibelle() { return categorieLibelle; }
    public void setCategorieLibelle(String categorieLibelle) { this.categorieLibelle = categorieLibelle; }
    
    public Long getCategorieId() { return categorieId; }
    public void setCategorieId(Long categorieId) { this.categorieId = categorieId; }
}