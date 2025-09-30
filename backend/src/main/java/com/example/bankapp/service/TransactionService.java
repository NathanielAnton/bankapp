// TransactionService.java
package com.example.bankapp.service;

import com.example.bankapp.dto.request.TransactionRequest;
import com.example.bankapp.dto.response.TransactionResponse;
import com.example.bankapp.entity.*;
import com.example.bankapp.repository.AccountRepository;
import com.example.bankapp.repository.CategoryRepository;
import com.example.bankapp.repository.ClientProfileRepository;
import com.example.bankapp.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.bankapp.security.JwtUtil;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;
    private final ClientProfileRepository clientRepository;
    private final JwtUtil jwtUtil;


    public TransactionService(TransactionRepository transactionRepository,
                             AccountRepository accountRepository,
                             CategoryRepository categoryRepository,
                             ClientProfileRepository clientRepository,
                             JwtUtil jwtUtil) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.categoryRepository = categoryRepository;
        this.clientRepository = clientRepository;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request) {
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Compte non trouvé"));

        if (!account.isActif()) {
            throw new RuntimeException("Le compte n'est pas actif");
        }

        Transaction.TypeTransaction type = Transaction.TypeTransaction.valueOf(request.getType());
        Category categorie = null;
        
        if (request.getCategorieId() != null) {
            categorie = categoryRepository.findById(request.getCategorieId())
                    .orElse(null);
        }

        Transaction transaction;
        
        switch (type) {
            case DEBIT:
                if (!account.debiter(request.getMontant())) {
                    throw new RuntimeException("Solde insuffisant");
                }
                transaction = new Transaction(account, type, request.getMontant(), request.getDescription());
                break;
                
            case CREDIT:
                account.crediter(request.getMontant());
                transaction = new Transaction(account, type, request.getMontant(), request.getDescription());
                break;
                
            case VIREMENT_INTERNE:
            case VIREMENT_EXTERNE:
                if (request.getDestinataireAccountId() == null) {
                    throw new RuntimeException("Compte destinataire requis pour un virement");
                }
                
                Account destinataire = accountRepository.findById(request.getDestinataireAccountId())
                        .orElseThrow(() -> new RuntimeException("Compte destinataire non trouvé"));
                
                if (!destinataire.isActif()) {
                    throw new RuntimeException("Le compte destinataire n'est pas actif");
                }
                
                // Débiter le compte émetteur
                if (!account.debiter(request.getMontant())) {
                    throw new RuntimeException("Solde insuffisant pour le virement");
                }
                
                // Créditer le compte destinataire
                destinataire.crediter(request.getMontant());
                
                transaction = new Transaction(account, destinataire, type, request.getMontant(), request.getDescription());
                break;
                
            default:
                throw new RuntimeException("Type de transaction non supporté");
        }

        transaction.setCategorie(categorie);
        accountRepository.save(account);
        
        if (transaction.getDestinataireAccount() != null) {
            accountRepository.save(transaction.getDestinataireAccount());
        }
        
        if (request.getDateTransaction() != null) {
            transaction.setDateTransaction(request.getDateTransaction());
        } else {
            transaction.setDateTransaction(LocalDateTime.now());
        }
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        return mapToResponse(savedTransaction);
    }

    public List<TransactionResponse> getTransactionsByAccount(Long accountId) {
        return transactionRepository.findByAccountId(accountId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> getTransactionsByClient(Long clientId) {
        return transactionRepository.findByAccountClientId(clientId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TransactionResponse getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction non trouvée"));
        return mapToResponse(transaction);
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        TransactionResponse response = new TransactionResponse();
        response.setId(transaction.getId());
        response.setAccountId(transaction.getAccount().getId());
        
        if (transaction.getDestinataireAccount() != null) {
            response.setDestinataireAccountId(transaction.getDestinataireAccount().getId());
        }
        
        response.setType(transaction.getType().name());
        response.setTypeLibelle(transaction.getTypeLibelle());
        response.setMontant(transaction.getMontant());
        response.setDateTransaction(transaction.getDateTransaction());
        response.setDescription(transaction.getDescription());
        
        if (transaction.getCategorie() != null) {
            response.setCategorieLibelle(transaction.getCategorie().getLibelle());
        }
        
        return response;
    }
    
    @Transactional
    public TransactionResponse updateTransactionCategory(Long transactionId, Long categorieId) {
        // Récupérer la transaction
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction non trouvée"));

        // Récupérer la catégorie (si categorieId est null, on supprime la catégorie)
        Category categorie = null;
        if (categorieId != null) {
            categorie = categoryRepository.findById(categorieId)
                    .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
        }

        // Mettre à jour la catégorie
        transaction.setCategorie(categorie);
        
        Transaction updatedTransaction = transactionRepository.save(transaction);
        
        return mapToResponse(updatedTransaction);
    }

    // Méthode pour obtenir toutes les catégories disponibles
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Méthode pour obtenir les transactions par catégorie
    public List<TransactionResponse> getTransactionsByCategory(Long categorieId) {
        Category categorie = categoryRepository.findById(categorieId)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
        
        return transactionRepository.findByCategorie(categorie)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public List<TransactionResponse> getMyTransactions(String token) {
        if (!jwtUtil.isTokenValid(token)) {
            throw new RuntimeException("Token invalide ou expiré");
        }

        Long userId = jwtUtil.extractId(token);

        // Trouver le client associé à cet utilisateur
        ClientProfile client = clientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Client not found for user"));

        // 🔹 Récupérer toutes les transactions de ses comptes
        List<Transaction> transactionsEnvoyees = transactionRepository.findByAccountClientId(client.getId());

        // 🔹 Récupérer aussi les transactions où il est destinataire
        List<Account> comptes = accountRepository.findByClientId(client.getId());
        List<Transaction> transactionsRecues = comptes.stream()
                .flatMap(account -> transactionRepository.findByDestinataireAccountId(account.getId()).stream())
                .toList();

        // 🔹 Fusionner envoyées + reçues
        List<Transaction> allTransactions = new ArrayList<>();
        allTransactions.addAll(transactionsEnvoyees);
        allTransactions.addAll(transactionsRecues);

        // 🔹 Mapper en DTO
        return allTransactions.stream()
                .map(this::mapToResponse)
                .toList();
    }


}