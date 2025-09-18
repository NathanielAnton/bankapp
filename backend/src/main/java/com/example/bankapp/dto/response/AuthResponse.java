package com.example.bankapp.dto.response;

public class AuthResponse {
    private Long id;
    private String username;
    private String role;
    private String message;
    private String token;

    public AuthResponse() {}

    public AuthResponse(Long id, String username, String role, String message, String token) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.message = message;
        this.token = token;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
}
