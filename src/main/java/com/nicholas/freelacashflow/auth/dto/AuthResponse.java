package com.nicholas.freelacashflow.auth.dto;

import com.nicholas.freelacashflow.user.dto.UserResponse;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
