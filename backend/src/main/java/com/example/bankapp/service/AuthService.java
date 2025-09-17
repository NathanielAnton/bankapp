package com.example.bankapp.service;

import com.example.bankapp.dto.request.LoginRequest;
import com.example.bankapp.dto.request.RegisterRequest;
import com.example.bankapp.entity.ClientProfile;
import com.example.bankapp.entity.User;
import com.example.bankapp.repository.ClientProfileRepository;
import com.example.bankapp.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final ClientProfileRepository clientProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       ClientProfileRepository clientProfileRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.clientProfileRepository = clientProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterRequest request) {
        User user = new User(
                request.getUsername(),
                request.getUsername() + "@example.com",
                passwordEncoder.encode(request.getPassword()),
                "USER"
        );

        userRepository.save(user);

        ClientProfile profile = new ClientProfile(
                user,
                request.getNom(),
                request.getPrenom(),
                null,
                null,
                null
        );

        clientProfileRepository.save(profile);

        return user;
    }

    public User login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        return user;
    }
}
