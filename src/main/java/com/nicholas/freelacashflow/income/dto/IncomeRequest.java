package com.nicholas.freelacashflow.income.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record IncomeRequest(
        @NotBlank
        @Size(max = 120)
        String description,

        @NotNull
        @Positive
        BigDecimal amount,

        @NotNull
        LocalDate expectedDate,

        @Size(max = 120)
        String source
) {
}
