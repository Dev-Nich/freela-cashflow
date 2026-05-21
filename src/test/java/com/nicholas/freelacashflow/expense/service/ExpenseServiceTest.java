package com.nicholas.freelacashflow.expense.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.nicholas.freelacashflow.category.document.CategoryDocument;
import com.nicholas.freelacashflow.category.exception.CategoryNotFoundException;
import com.nicholas.freelacashflow.category.repository.CategoryRepository;
import com.nicholas.freelacashflow.expense.document.ExpenseDocument;
import com.nicholas.freelacashflow.expense.dto.ExpenseRequest;
import com.nicholas.freelacashflow.expense.dto.ExpenseResponse;
import com.nicholas.freelacashflow.expense.dto.PayExpenseRequest;
import com.nicholas.freelacashflow.expense.enums.ExpenseStatus;
import com.nicholas.freelacashflow.expense.exception.ExpenseNotFoundException;
import com.nicholas.freelacashflow.expense.repository.ExpenseRepository;
import com.nicholas.freelacashflow.security.CurrentUserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CurrentUserService currentUserService;

    @InjectMocks
    private ExpenseService expenseService;

    @Test
    void shouldCreatePendingExpenseForCurrentUserCategory() {
        when(currentUserService.getCurrentUserId()).thenReturn("user-1");
        when(categoryRepository.findByCategoryIdAndUserId("category-1", "user-1"))
                .thenReturn(Optional.of(CategoryDocument.builder().categoryId("category-1").build()));
        when(expenseRepository.save(any(ExpenseDocument.class))).thenAnswer(invocation -> {
            ExpenseDocument expense = invocation.getArgument(0);
            expense.setId("expense-1");
            return expense;
        });

        ExpenseResponse response = expenseService.create(new ExpenseRequest(
                "category-1",
                " Parcela PC ",
                new BigDecimal("1000.00"),
                LocalDate.of(2026, 6, 17),
                true
        ));

        assertThat(response.id()).isEqualTo("expense-1");
        assertThat(response.description()).isEqualTo("Parcela PC");
        assertThat(response.status()).isEqualTo(ExpenseStatus.PENDING);
        assertThat(response.fixed()).isTrue();
    }

    @Test
    void shouldRejectExpenseWhenCategoryDoesNotBelongToCurrentUser() {
        when(currentUserService.getCurrentUserId()).thenReturn("user-1");
        when(categoryRepository.findByCategoryIdAndUserId("category-1", "user-1")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> expenseService.create(new ExpenseRequest(
                "category-1",
                "Parcela PC",
                new BigDecimal("1000.00"),
                LocalDate.of(2026, 6, 17),
                true
        ))).isInstanceOf(CategoryNotFoundException.class);
    }

    @Test
    void shouldFilterExpensesByMonthAndYear() {
        when(currentUserService.getCurrentUserId()).thenReturn("user-1");
        when(expenseRepository.findAllByUserIdAndDueDateBetween(
                "user-1",
                LocalDate.of(2026, 6, 1),
                LocalDate.of(2026, 6, 30)
        )).thenReturn(List.of(expense("expense-1", ExpenseStatus.PENDING)));

        List<ExpenseResponse> response = expenseService.findAll(6, 2026);

        assertThat(response).hasSize(1);
        assertThat(response.get(0).id()).isEqualTo("expense-1");
    }

    @Test
    void shouldMarkExpenseAsPaid() {
        ExpenseDocument expense = expense("expense-1", ExpenseStatus.PENDING);
        when(currentUserService.getCurrentUserId()).thenReturn("user-1");
        when(expenseRepository.findByIdAndUserId("expense-1", "user-1")).thenReturn(Optional.of(expense));
        when(expenseRepository.save(expense)).thenReturn(expense);

        ExpenseResponse response = expenseService.pay(
                "expense-1",
                new PayExpenseRequest(LocalDate.of(2026, 6, 17))
        );

        assertThat(response.status()).isEqualTo(ExpenseStatus.PAID);
        assertThat(response.paidDate()).isEqualTo(LocalDate.of(2026, 6, 17));
    }

    @Test
    void shouldThrowWhenExpenseDoesNotBelongToCurrentUser() {
        when(currentUserService.getCurrentUserId()).thenReturn("user-1");
        when(expenseRepository.findByIdAndUserId("expense-1", "user-1")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> expenseService.findById("expense-1"))
                .isInstanceOf(ExpenseNotFoundException.class);
    }

    private ExpenseDocument expense(String id, ExpenseStatus status) {
        return ExpenseDocument.builder()
                .id(id)
                .userId("user-1")
                .categoryId("category-1")
                .description("Parcela PC")
                .amount(new BigDecimal("1000.00"))
                .dueDate(LocalDate.of(2026, 6, 17))
                .status(status)
                .fixed(true)
                .build();
    }
}
