package com.example.bankapp.service;

import com.example.bankapp.dto.request.RegisterRequest;
import com.example.bankapp.entity.ClientProfile;
import com.example.bankapp.entity.User;
import com.example.bankapp.repository.ClientProfileRepository;
import com.example.bankapp.repository.UserRepository;
import com.example.bankapp.security.JwtUtil;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final ClientProfileRepository clientProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       ClientProfileRepository clientProfileRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.clientProfileRepository = clientProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
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

    public String login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        return jwtUtil.generateToken(username);
    }
}
