package com.example.bankapp.controller;

import com.example.bankapp.dto.response.AuthResponse;
import com.example.bankapp.dto.request.LoginRequest;
import com.example.bankapp.dto.request.RegisterRequest;
import com.example.bankapp.entity.User;
import com.example.bankapp.service.AuthService;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200") // Add this for Angular dev server
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        User user = authService.register(request);

        AuthResponse response = new AuthResponse(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                "Inscription réussie"
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String token = authService.login(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(Map.of("token", token));
    }
}
