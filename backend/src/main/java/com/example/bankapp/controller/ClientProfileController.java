package com.example.bankapp.controller;

import com.example.bankapp.dto.request.ClientProfileRequest;
import com.example.bankapp.dto.response.ClientProfileResponse;
import com.example.bankapp.service.ClientProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/client-profiles")
public class ClientProfileController {

    @Autowired
    private ClientProfileService clientProfileService;

    @GetMapping("/me")
    public ResponseEntity<ClientProfileResponse> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        ClientProfileResponse profile = clientProfileService.getProfileForUser(userDetails.getUsername());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<ClientProfileResponse> updateMyProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ClientProfileRequest profileRequest) {
        ClientProfileResponse updated = clientProfileService.updateProfile(userDetails.getUsername(), profileRequest);
        return ResponseEntity.ok(updated);
    }

    @PostMapping
    public ResponseEntity<ClientProfileResponse> createProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ClientProfileRequest profileRequest) {
        ClientProfileResponse created = clientProfileService.createProfile(userDetails.getUsername(), profileRequest);
        return ResponseEntity.ok(created);
    }
}