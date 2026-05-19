package com.nicholas.freelacashflow.dto.response;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
