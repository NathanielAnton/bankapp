package com.example.bankapp;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destinataire_account_id")
    private Account destinataireAccount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeTransaction type;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal montant;

    @Column(name = "date_transaction", nullable = false)
    private LocalDateTime dateTransaction;

    @Column(length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categorie_id")
    private Category categorie;

    // Enum pour les types de transaction
    public enum TypeTransaction {
        DEBIT("Débit"),
        CREDIT("Crédit"), 
        VIREMENT_INTERNE("Virement Interne"),
        VIREMENT_EXTERNE("Virement Externe");

        private final String description;

        TypeTransaction(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    // Constructors
    public Transaction() {
        this.dateTransaction = LocalDateTime.now();
    }

    public Transaction(Account account, TypeTransaction type, BigDecimal montant, String description) {
        this();
        this.account = account;
        this.type = type;
        this.montant = montant;
        this.description = description;
    }

    public Transaction(Account account, Account destinataireAccount, TypeTransaction type, BigDecimal montant, String description) {
        this(account, type, montant, description);
        this.destinataireAccount = destinataireAccount;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public Account getDestinataireAccount() {
        return destinataireAccount;
    }

    public void setDestinataireAccount(Account destinataireAccount) {
        this.destinataireAccount = destinataireAccount;
    }

    public TypeTransaction getType() {
        return type;
    }

    public void setType(TypeTransaction type) {
        this.type = type;
    }

    public BigDecimal getMontant() {
        return montant;
    }

    public void setMontant(BigDecimal montant) {
        this.montant = montant;
    }

    public LocalDateTime getDateTransaction() {
        return dateTransaction;
    }

    public void setDateTransaction(LocalDateTime dateTransaction) {
        this.dateTransaction = dateTransaction;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Category getCategorie() {
        return categorie;
    }

    public void setCategorie(Category categorie) {
        this.categorie = categorie;
    }

    // Méthodes utiles
    public boolean isVirement() {
        return type == TypeTransaction.VIREMENT_INTERNE || type == TypeTransaction.VIREMENT_EXTERNE;
    }

    public boolean isDebit() {
        return type == TypeTransaction.DEBIT || 
               (isVirement() && destinataireAccount != null);
    }

    public boolean isCredit() {
        return type == TypeTransaction.CREDIT;
    }

    public String getTypeLibelle() {
        return type.getDescription();
    }
}