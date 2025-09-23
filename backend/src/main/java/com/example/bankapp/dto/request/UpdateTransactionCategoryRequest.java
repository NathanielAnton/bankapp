package com.example.bankapp.dto.request;

import jakarta.validation.constraints.NotNull;

public class UpdateTransactionCategoryRequest {
    
    @NotNull(message = "L'ID de la catégorie est obligatoire")
    private Long categorieId;

    // Constructeur par défaut
    public UpdateTransactionCategoryRequest() {
    }

    // Constructeur avec paramètres
    public UpdateTransactionCategoryRequest(Long categorieId) {
        this.categorieId = categorieId;
    }

    // Getters et Setters
    public Long getCategorieId() {
        return categorieId;
    }

    public void setCategorieId(Long categorieId) {
        this.categorieId = categorieId;
    }
}