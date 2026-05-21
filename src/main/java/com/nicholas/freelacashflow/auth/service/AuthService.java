package com.nicholas.freelacashflow.auth.service;

import java.time.LocalDateTime;

import com.nicholas.freelacashflow.auth.dto.AuthResponse;
import com.nicholas.freelacashflow.auth.dto.LoginRequest;
import com.nicholas.freelacashflow.auth.dto.RegisterRequest;
import com.nicholas.freelacashflow.auth.exception.EmailAlreadyRegisteredException;
import com.nicholas.freelacashflow.auth.exception.InvalidCredentialsException;
import com.nicholas.freelacashflow.security.AuthenticatedUser;
import com.nicholas.freelacashflow.security.JwtService;
import com.nicholas.freelacashflow.user.document.UserDocument;
import com.nicholas.freelacashflow.user.dto.UserResponse;
import com.nicholas.freelacashflow.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());

        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyRegisteredException(email);
        }

        LocalDateTime now = LocalDateTime.now();
        UserDocument user = UserDocument.builder()
                .name(request.name().trim())
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .createdAt(now)
                .updatedAt(now)
                .build();

        UserDocument savedUser = userRepository.save(user);
        String token = jwtService.generateToken(new AuthenticatedUser(savedUser));

        return new AuthResponse(token, toResponse(savedUser));
    }

    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());
        UserDocument user = userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        String token = jwtService.generateToken(new AuthenticatedUser(user));

        return new AuthResponse(token, toResponse(user));
    }

    private UserResponse toResponse(UserDocument user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail());
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
