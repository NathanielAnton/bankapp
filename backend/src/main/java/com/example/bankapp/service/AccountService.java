package com.example.bankapp.service;

import org.springframework.stereotype.Service;

import com.example.bankapp.dto.request.AccountRequest;
import com.example.bankapp.dto.response.AccountResponse;
import com.example.bankapp.entity.Account;
import com.example.bankapp.entity.ClientProfile;
import com.example.bankapp.repository.AccountRepository;
import com.example.bankapp.repository.ClientProfileRepository;
import com.example.bankapp.repository.UserRepository;
import com.example.bankapp.security.JwtUtil;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final ClientProfileRepository clientRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AccountService(AccountRepository accountRepository,
                          ClientProfileRepository clientRepository,
                          UserRepository userRepository,
                          JwtUtil jwtUtil) {
        this.accountRepository = accountRepository;
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    // CREATE
    public AccountResponse createAccount(AccountRequest dto) {
        ClientProfile client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Account account = new Account();
        account.setClient(client);
        account.setType(dto.getType());
        account.setSolde(dto.getSolde() != null ? dto.getSolde() : BigDecimal.ZERO);
        account.setStatut(dto.getStatut() != null ? dto.getStatut() : Account.StatutCompte.ACTIF);
        account.setDateOuverture(LocalDate.now());

        return mapToResponse(accountRepository.save(account));
    }

    // READ (all)
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    // READ (by id)
    public AccountResponse getAccountById(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return mapToResponse(account);
    }

    // UPDATE
    public AccountResponse updateAccount(Long id, AccountRequest dto) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (dto.getType() != null) account.setType(dto.getType());
        if (dto.getSolde() != null) account.setSolde(dto.getSolde());
        if (dto.getStatut() != null) account.setStatut(dto.getStatut());
        if (dto.getClientId() != null) {
            ClientProfile client = clientRepository.findById(dto.getClientId())
                    .orElseThrow(() -> new RuntimeException("Client not found"));
            account.setClient(client);
        }

        return mapToResponse(accountRepository.save(account));
    }

    // DELETE
    public void deleteAccount(Long id) {
        if (!accountRepository.existsById(id)) {
            throw new RuntimeException("Account not found");
        }
        accountRepository.deleteById(id);
    }

    // READ my accounts (via JWT token)
    public List<AccountResponse> getMyAccounts(String token) {
    	
    	if (!jwtUtil.isTokenValid(token)) {
            throw new RuntimeException("Token invalide ou expiré");
        }
        
        Long userId = jwtUtil.extractId(token);
        
        // Trouver le client associé à cet utilisateur
        ClientProfile client = clientRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Client not found for user"));
        
        return accountRepository.findByClientId(client.getId()).stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Mapper entité → DTO
    private AccountResponse mapToResponse(Account account) {
        AccountResponse dto = new AccountResponse();
        dto.setId(account.getId());
        dto.setClientId(account.getClient().getId());
        dto.setType(account.getType().name());
        dto.setSolde(account.getSolde());
        dto.setStatut(account.getStatut().name());
        dto.setDateOuverture(account.getDateOuverture());
        return dto;
    }
}
