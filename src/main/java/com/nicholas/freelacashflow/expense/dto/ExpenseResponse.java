package com.nicholas.freelacashflow.expense.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.nicholas.freelacashflow.expense.enums.ExpenseStatus;

public record ExpenseResponse(
        String id,
        String categoryId,
        String description,
        BigDecimal amount,
        LocalDate dueDate,
        LocalDate paidDate,
        ExpenseStatus status,
        boolean fixed,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
