package com.example.bankapp.dto.request;

import java.math.BigDecimal;

import com.example.bankapp.entity.Account;

//DTO pour créer ou mettre à jour un compte
public class AccountRequest {
 private Long clientId;
 private Account.TypeCompte type;
 private BigDecimal solde;
 private Account.StatutCompte statut;

 // Constructeur par défaut
 public AccountRequest() {
 }

 // Constructeur avec paramètres
 public AccountRequest(Long clientId, Account.TypeCompte type, BigDecimal solde, Account.StatutCompte statut) {
     this.clientId = clientId;
     this.type = type;
     this.solde = solde;
     this.statut = statut;
 }

 // Getters
 public Long getClientId() {
     return clientId;
 }

 public Account.TypeCompte getType() {
     return type;
 }

 public BigDecimal getSolde() {
     return solde;
 }

 public Account.StatutCompte getStatut() {
     return statut;
 }

 // Setters
 public void setClientId(Long clientId) {
     this.clientId = clientId;
 }

 public void setType(Account.TypeCompte type) {
     this.type = type;
 }

 public void setSolde(BigDecimal solde) {
     this.solde = solde;
 }

 public void setStatut(Account.StatutCompte statut) {
     this.statut = statut;
 }

}