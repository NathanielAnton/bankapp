package com.example.bankapp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "accounts")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonBackReference // ← Côté enfant de la relation avec Transaction
    private List<Transaction> transactions = new ArrayList<>();

    @OneToMany(mappedBy = "destinataireAccount", cascade = CascadeType.ALL, fetch = FetchType.LAZY)  
    @JsonBackReference // ← Côté enfant de la relation avec Transaction (destinataire)
    private List<Transaction> transactionsRecues = new ArrayList<>();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @JsonIgnore  
    private ClientProfile client;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeCompte type;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal solde = BigDecimal.ZERO;

    @Column(name = "date_ouverture", nullable = false)
    private LocalDate dateOuverture;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutCompte statut = StatutCompte.ACTIF;
    
    // Enums
    public enum TypeCompte {
        COURANT("Compte Courant"),
        EPARGNE("Compte Épargne"),
        LIVRET_A("Livret A"),
        LIVRET_JEUNE("Livret Jeune"),
        PEL("Plan Épargne Logement"),
        CEL("Compte Épargne Logement");

        private final String description;

        TypeCompte(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    public enum StatutCompte {
        ACTIF("Actif"),
        BLOQUE("Bloqué"),
        CLOTURE("Clôturé");

        private final String description;

        StatutCompte(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    // Constructors
    public Account() {
        this.dateOuverture = LocalDate.now();
    }

    public Account(ClientProfile client, TypeCompte type, BigDecimal soldeInitial) {
        this();
        this.client = client;
        this.type = type;
        this.solde = soldeInitial != null ? soldeInitial : BigDecimal.ZERO;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ClientProfile getClient() {
        return client;
    }

    public void setClient(ClientProfile client) {
        this.client = client;
    }

    public TypeCompte getType() {
        return type;
    }

    public void setType(TypeCompte type) {
        this.type = type;
    }

    public BigDecimal getSolde() {
        return solde;
    }

    public void setSolde(BigDecimal solde) {
        this.solde = solde;
    }

    public LocalDate getDateOuverture() {
        return dateOuverture;
    }

    public void setDateOuverture(LocalDate dateOuverture) {
        this.dateOuverture = dateOuverture;
    }

    public StatutCompte getStatut() {
        return statut;
    }

    public void setStatut(StatutCompte statut) {
        this.statut = statut;
    }

    // Méthodes utiles
    public boolean isActif() {
        return this.statut == StatutCompte.ACTIF;
    }

    public boolean peutEffectuerTransaction() {
        return this.statut == StatutCompte.ACTIF;
    }

    public void crediter(BigDecimal montant) {
        if (montant.compareTo(BigDecimal.ZERO) > 0 && peutEffectuerTransaction()) {
            this.solde = this.solde.add(montant);
        }
    }

    public boolean debiter(BigDecimal montant) {
        if (montant.compareTo(BigDecimal.ZERO) > 0 && 
            peutEffectuerTransaction() && 
            this.solde.compareTo(montant) >= 0) {
            this.solde = this.solde.subtract(montant);
            return true;
        }
        return false;
    }
}