package com.nicholas.freelacashflow.income.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

public record ReceiveIncomeRequest(
        @NotNull
        LocalDate receivedDate
) {
}
