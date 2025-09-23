package com.example.bankapp.repository;

import com.example.bankapp.entity.Account;
import com.example.bankapp.entity.Category;
import com.example.bankapp.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccountId(Long accountId);
    List<Transaction> findByDestinataireAccountId(Long destinataireAccountId);
    List<Transaction> findByAccountClientId(Long clientId);
    List<Transaction> findByCategorie(Category categorie);
}