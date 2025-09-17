package com.example.bankapp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bankapp.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    // Retourne un utilisateur si le username existe
    Optional<User> findByUsername(String username);

    // (Optionnel) si tu veux aussi vérifier l’existence d’un username
    boolean existsByUsername(String username);

    // (Optionnel) si tu veux aussi vérifier l’existence d’un email
    boolean existsByEmail(String email);
}
