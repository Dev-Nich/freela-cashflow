package com.nicholas.freelacashflow.summary.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.nicholas.freelacashflow.expense.document.ExpenseDocument;
import com.nicholas.freelacashflow.expense.enums.ExpenseStatus;
import com.nicholas.freelacashflow.expense.repository.ExpenseRepository;
import com.nicholas.freelacashflow.income.document.IncomeDocument;
import com.nicholas.freelacashflow.income.enums.IncomeStatus;
import com.nicholas.freelacashflow.income.repository.IncomeRepository;
import com.nicholas.freelacashflow.security.CurrentUserService;
import com.nicholas.freelacashflow.summary.dto.MonthlySummaryResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class MonthlySummaryServiceTest {

    @Mock
    private IncomeRepository incomeRepository;

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private CurrentUserService currentUserService;

    @InjectMocks
    private MonthlySummaryService monthlySummaryService;

    @Test
    void shouldGenerateMonthlySummary() {
        String userId = "user-1";
        when(currentUserService.getCurrentUserId()).thenReturn(userId);
        when(incomeRepository.findAllByUserIdAndExpectedDateBetween(
                userId,
                LocalDate.of(2026, 6, 1),
                LocalDate.of(2026, 6, 30)
        )).thenReturn(List.of(
                income("1500.00", IncomeStatus.RECEIVED),
                income("1500.00", IncomeStatus.EXPECTED)
        ));
        when(expenseRepository.findAllByUserIdAndDueDateBetween(
                userId,
                LocalDate.of(2026, 6, 1),
                LocalDate.of(2026, 6, 30)
        )).thenReturn(List.of(
                expense("1000.00", ExpenseStatus.PAID),
                expense("200.00", ExpenseStatus.PENDING)
        ));

        MonthlySummaryResponse response = monthlySummaryService.generate(6, 2026);

        assertThat(response.expectedIncome()).isEqualByComparingTo("3000.00");
        assertThat(response.receivedIncome()).isEqualByComparingTo("1500.00");
        assertThat(response.expectedExpenses()).isEqualByComparingTo("1200.00");
        assertThat(response.paidExpenses()).isEqualByComparingTo("1000.00");
        assertThat(response.pendingExpenses()).isEqualByComparingTo("200.00");
        assertThat(response.expectedBalance()).isEqualByComparingTo("1800.00");
        assertThat(response.realBalance()).isEqualByComparingTo("500.00");
        assertThat(response.committedIncomePercentage()).isEqualByComparingTo("40.00");
    }

    @Test
    void shouldIgnoreCanceledRecordsAndAvoidDivisionByZero() {
        String userId = "user-1";
        when(currentUserService.getCurrentUserId()).thenReturn(userId);
        when(incomeRepository.findAllByUserIdAndExpectedDateBetween(
                userId,
                LocalDate.of(2026, 6, 1),
                LocalDate.of(2026, 6, 30)
        )).thenReturn(List.of(income("1500.00", IncomeStatus.CANCELED)));
        when(expenseRepository.findAllByUserIdAndDueDateBetween(
                userId,
                LocalDate.of(2026, 6, 1),
                LocalDate.of(2026, 6, 30)
        )).thenReturn(List.of(expense("200.00", ExpenseStatus.CANCELED)));

        MonthlySummaryResponse response = monthlySummaryService.generate(6, 2026);

        assertThat(response.expectedIncome()).isEqualByComparingTo("0.00");
        assertThat(response.expectedExpenses()).isEqualByComparingTo("0.00");
        assertThat(response.committedIncomePercentage()).isEqualByComparingTo("0.00");
    }

    private IncomeDocument income(String amount, IncomeStatus status) {
        return IncomeDocument.builder()
                .amount(new BigDecimal(amount))
                .status(status)
                .build();
    }

    private ExpenseDocument expense(String amount, ExpenseStatus status) {
        return ExpenseDocument.builder()
                .amount(new BigDecimal(amount))
                .status(status)
                .build();
    }
}
