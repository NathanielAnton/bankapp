package com.example.bankapp.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

// DTO pour la réponse (plus safe que renvoyer l'entité JPA brute)
public class AccountResponse {
    private Long id;
    private Long clientId;
    private String type;
    private BigDecimal solde;
    private String statut;
    private LocalDate dateOuverture;

    // Constructeur par défaut
    public AccountResponse() {
    }

    // Constructeur avec tous les paramètres
    public AccountResponse(Long id, Long clientId, String type, BigDecimal solde, String statut, LocalDate dateOuverture) {
        this.id = id;
        this.clientId = clientId;
        this.type = type;
        this.solde = solde;
        this.statut = statut;
        this.dateOuverture = dateOuverture;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public Long getClientId() {
        return clientId;
    }

    public String getType() {
        return type;
    }

    public BigDecimal getSolde() {
        return solde;
    }

    public String getStatut() {
        return statut;
    }

    public LocalDate getDateOuverture() {
        return dateOuverture;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setSolde(BigDecimal solde) {
        this.solde = solde;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public void setDateOuverture(LocalDate dateOuverture) {
        this.dateOuverture = dateOuverture;
    }

    @Override
    public String toString() {
        return "AccountResponse{" +
                "id=" + id +
                ", clientId=" + clientId +
                ", type='" + type + '\'' +
                ", solde=" + solde +
                ", statut='" + statut + '\'' +
                ", dateOuverture=" + dateOuverture +
                '}';
    }
}