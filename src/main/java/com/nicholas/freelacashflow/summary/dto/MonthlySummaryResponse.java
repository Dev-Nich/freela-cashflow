package com.nicholas.freelacashflow.summary.dto;

import java.math.BigDecimal;

public record MonthlySummaryResponse(
        int month,
        int year,
        BigDecimal expectedIncome,
        BigDecimal receivedIncome,
        BigDecimal expectedExpenses,
        BigDecimal paidExpenses,
        BigDecimal pendingExpenses,
        BigDecimal expectedBalance,
        BigDecimal realBalance,
        BigDecimal committedIncomePercentage
) {
}
