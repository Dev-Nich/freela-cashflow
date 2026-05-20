package com.nicholas.freelacashflow.expense.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record ExpenseRequest(
        @NotBlank
        String categoryId,

        @NotBlank
        @Size(max = 120)
        String description,

        @NotNull
        @Positive
        BigDecimal amount,

        @NotNull
        LocalDate dueDate,

        boolean fixed
) {
}
