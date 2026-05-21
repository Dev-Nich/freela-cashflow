package com.nicholas.freelacashflow.auth.controller;

import com.nicholas.freelacashflow.auth.dto.AuthResponse;
import com.nicholas.freelacashflow.auth.dto.LoginRequest;
import com.nicholas.freelacashflow.auth.dto.RegisterRequest;
import com.nicholas.freelacashflow.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticacao", description = "Cadastro, login e emissao de tokens JWT.")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Cadastrar usuario", description = "Cria uma conta, normaliza o e-mail e retorna um JWT para usar nos endpoints protegidos.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Usuario cadastrado com sucesso."),
            @ApiResponse(responseCode = "400", description = "Payload invalido."),
            @ApiResponse(responseCode = "409", description = "E-mail ja cadastrado.")
    })
    public AuthResponse register(@RequestBody @Valid RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    @Operation(summary = "Autenticar usuario", description = "Valida e-mail e senha e retorna um JWT quando as credenciais estao corretas.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login realizado com sucesso."),
            @ApiResponse(responseCode = "400", description = "Payload invalido."),
            @ApiResponse(responseCode = "401", description = "Credenciais invalidas.")
    })
    public AuthResponse login(@RequestBody @Valid LoginRequest request) {
        return authService.login(request);
    }
}
