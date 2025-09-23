package com.example.bankapp.service;

import com.example.bankapp.dto.request.ClientProfileRequest;
import com.example.bankapp.dto.response.ClientProfileResponse;
import com.example.bankapp.entity.ClientProfile;
import com.example.bankapp.entity.User;
import com.example.bankapp.repository.ClientProfileRepository;
import com.example.bankapp.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

@Service
@Validated
public class ClientProfileService {

    @Autowired
    private ClientProfileRepository clientProfileRepository;

    @Autowired
    private UserRepository userRepository;

    public ClientProfileResponse getProfileForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        ClientProfile profile = clientProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profil client non trouvé"));
        
        return toResponseDTO(profile);
    }

    public ClientProfileResponse updateProfile(String username, @Valid ClientProfileRequest profileRequest) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        ClientProfile profile = clientProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profil client non trouvé"));

        // Mise à jour des champs
        profile.setNom(profileRequest.getNom());
        profile.setPrenom(profileRequest.getPrenom());
        profile.setAdresse(profileRequest.getAdresse());
        profile.setTelephone(profileRequest.getTelephone());
        profile.setDateNaissance(profileRequest.getDateNaissance());
        
        ClientProfile savedProfile = clientProfileRepository.save(profile);
        return toResponseDTO(savedProfile);
    }

    public ClientProfileResponse createProfile(String username, @Valid ClientProfileRequest profileRequest) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (clientProfileRepository.findByUserId(user.getId()).isPresent()) {
            throw new RuntimeException("Un profil existe déjà pour cet utilisateur");
        }

        ClientProfile profile = new ClientProfile();
        profile.setUser(user);
        profile.setNom(profileRequest.getNom());
        profile.setPrenom(profileRequest.getPrenom());
        profile.setAdresse(profileRequest.getAdresse());
        profile.setTelephone(profileRequest.getTelephone());
        profile.setDateNaissance(profileRequest.getDateNaissance());
        
        ClientProfile savedProfile = clientProfileRepository.save(profile);
        return toResponseDTO(savedProfile);
    }

    // Méthode utilitaire pour convertir Entity en Response DTO
    private ClientProfileResponse toResponseDTO(ClientProfile profile) {
        return new ClientProfileResponse(
            profile.getId(),
            profile.getUser().getId(),
            profile.getNom(),
            profile.getPrenom(),
            profile.getAdresse(),
            profile.getTelephone(),
            profile.getDateNaissance()
        );
    }
}