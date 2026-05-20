package com.nicholas.freelacashflow.summary.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.YearMonth;
import java.util.List;

import com.nicholas.freelacashflow.expense.document.ExpenseDocument;
import com.nicholas.freelacashflow.expense.enums.ExpenseStatus;
import com.nicholas.freelacashflow.expense.repository.ExpenseRepository;
import com.nicholas.freelacashflow.income.document.IncomeDocument;
import com.nicholas.freelacashflow.income.enums.IncomeStatus;
import com.nicholas.freelacashflow.income.repository.IncomeRepository;
import com.nicholas.freelacashflow.security.CurrentUserService;
import com.nicholas.freelacashflow.summary.dto.MonthlySummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MonthlySummaryService {

    private static final BigDecimal ONE_HUNDRED = BigDecimal.valueOf(100);

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final CurrentUserService currentUserService;

    public MonthlySummaryResponse generate(int month, int year) {
        String userId = currentUserService.getCurrentUserId();
        YearMonth yearMonth = YearMonth.of(year, month);

        List<IncomeDocument> incomes = incomeRepository.findAllByUserIdAndExpectedDateBetween(
                userId,
                yearMonth.atDay(1),
                yearMonth.atEndOfMonth()
        );
        List<ExpenseDocument> expenses = expenseRepository.findAllByUserIdAndDueDateBetween(
                userId,
                yearMonth.atDay(1),
                yearMonth.atEndOfMonth()
        );

        BigDecimal expectedIncome = sumIncomesExceptCanceled(incomes);
        BigDecimal receivedIncome = sumReceivedIncomes(incomes);
        BigDecimal expectedExpenses = sumExpensesExceptCanceled(expenses);
        BigDecimal paidExpenses = sumPaidExpenses(expenses);
        BigDecimal pendingExpenses = expectedExpenses.subtract(paidExpenses);
        BigDecimal expectedBalance = expectedIncome.subtract(expectedExpenses);
        BigDecimal realBalance = receivedIncome.subtract(paidExpenses);
        BigDecimal committedIncomePercentage = calculateCommittedIncomePercentage(expectedExpenses, expectedIncome);

        return new MonthlySummaryResponse(
                month,
                year,
                expectedIncome,
                receivedIncome,
                expectedExpenses,
                paidExpenses,
                pendingExpenses,
                expectedBalance,
                realBalance,
                committedIncomePercentage
        );
    }

    private BigDecimal sumIncomesExceptCanceled(List<IncomeDocument> incomes) {
        return incomes.stream()
                .filter(income -> income.getStatus() != IncomeStatus.CANCELED)
                .map(IncomeDocument::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal sumReceivedIncomes(List<IncomeDocument> incomes) {
        return incomes.stream()
                .filter(income -> income.getStatus() == IncomeStatus.RECEIVED)
                .map(IncomeDocument::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal sumExpensesExceptCanceled(List<ExpenseDocument> expenses) {
        return expenses.stream()
                .filter(expense -> expense.getStatus() != ExpenseStatus.CANCELED)
                .map(ExpenseDocument::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal sumPaidExpenses(List<ExpenseDocument> expenses) {
        return expenses.stream()
                .filter(expense -> expense.getStatus() == ExpenseStatus.PAID)
                .map(ExpenseDocument::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculateCommittedIncomePercentage(BigDecimal expectedExpenses, BigDecimal expectedIncome) {
        if (expectedIncome.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }

        return expectedExpenses
                .multiply(ONE_HUNDRED)
                .divide(expectedIncome, 2, RoundingMode.HALF_UP);
    }
}
