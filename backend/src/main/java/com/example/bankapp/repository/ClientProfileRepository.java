package com.example.bankapp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.bankapp.entity.ClientProfile;

@Repository
public interface ClientProfileRepository extends JpaRepository<ClientProfile, Long> {
    // Si besoin, tu peux ajouter des méthodes personnalisées ici, par ex :
	Optional<ClientProfile> findByUserId(Long userId);
}
