package com.example.bankapp;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    // Définir un utilisateur en mémoire
    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails user = User.withUsername("admin")
                .password("{noop}admin123") // {noop} = pas d'encodage
                .roles("USER")
                .build();
        return new InMemoryUserDetailsManager(user);
    }

    // Configurer les règles de sécurité
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // désactive CSRF pour simplifier
            .authorizeHttpRequests(auth -> auth
                .anyRequest().authenticated() // toute requête doit être authentifiée
            )
            .httpBasic(); // Active Basic Auth
        return http.build();
    }
}

