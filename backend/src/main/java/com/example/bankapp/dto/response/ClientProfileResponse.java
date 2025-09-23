package com.example.bankapp.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

// DTO pour la réponse (plus safe que renvoyer l'entité JPA brute)
public class ClientProfileResponse {
    private Long id;
    private Long userId;
    private String nom;
    private String prenom;
    private String adresse;
    private String telephone;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateNaissance;

    // Constructeur par défaut
    public ClientProfileResponse() {
    }

    // Constructeur avec tous les paramètres
    public ClientProfileResponse(Long id, Long userId, String nom, String prenom, String adresse, String telephone, LocalDate dateNaissance) {
        this.id = id;
        this.userId = userId;
        this.nom = nom;
        this.prenom = prenom;
        this.adresse = adresse;
        this.telephone = telephone;
        this.dateNaissance = dateNaissance;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getNom() {
        return nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public String getAdresse() {
        return adresse;
    }

    public String getTelephone() {
        return telephone;
    }

    public LocalDate getDateNaissance() {
        return dateNaissance;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    @Override
    public String toString() {
        return "ClientProfileResponse{" +
                "id=" + id +
                ", userId=" + userId +
                ", nom='" + nom + '\'' +
                ", prenom='" + prenom + '\'' +
                ", adresse='" + adresse + '\'' +
                ", telephone='" + telephone + '\'' +
                ", dateNaissance=" + dateNaissance +
                '}';
    }
}