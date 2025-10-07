package com.example.bankapp.controller;

import com.example.bankapp.dto.request.AccountRequest;
import com.example.bankapp.dto.response.AccountResponse;
import com.example.bankapp.service.AccountService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(@RequestBody AccountRequest dto) {
        return new ResponseEntity<>(accountService.createAccount(dto), HttpStatus.CREATED);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<AccountResponse>> getAllAccounts() {
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getAccountById(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<AccountResponse> updateAccount(@PathVariable Long id, @RequestBody AccountRequest dto) {
        return ResponseEntity.ok(accountService.updateAccount(id, dto));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }
    
    // Get MyAcc
    @GetMapping("/me")
    public ResponseEntity<List<AccountResponse>> getMyAccounts(@RequestHeader("Authorization") String authHeader) {
        // Extraire le token après "Bearer "
        String token = authHeader.substring(7);
        return ResponseEntity.ok(accountService.getMyAccounts(token));
    }
    
    // Changes about Status
    @PostMapping("/{accountId}/bloquer")
    public ResponseEntity<?> bloquerCompte(@PathVariable Long accountId) {
        try {
            return ResponseEntity.ok(accountService.bloquerCompte(accountId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{accountId}/debloquer")
    public ResponseEntity<?> debloquerCompte(@PathVariable Long accountId) {
        try {
            return ResponseEntity.ok(accountService.debloquerCompte(accountId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{accountId}/cloturer")
    public ResponseEntity<?> cloturerCompte(@PathVariable Long accountId) {
        try {
            return ResponseEntity.ok(accountService.cloturerCompte(accountId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
