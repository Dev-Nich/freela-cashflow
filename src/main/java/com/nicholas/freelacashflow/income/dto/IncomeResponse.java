package com.nicholas.freelacashflow.income.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.nicholas.freelacashflow.income.enums.IncomeStatus;

public record IncomeResponse(
        String id,
        String description,
        BigDecimal amount,
        LocalDate expectedDate,
        LocalDate receivedDate,
        IncomeStatus status,
        String source,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
