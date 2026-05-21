package com.nicholas.freelacashflow.expense.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final CurrentUserService currentUserService;

    public ExpenseResponse create(ExpenseRequest request) {
        String userId = currentUserService.getCurrentUserId();
        validateCategoryBelongsToUser(request.categoryId(), userId);

        LocalDateTime now = LocalDateTime.now();
        ExpenseDocument expense = ExpenseDocument.builder()
                .userId(userId)
                .categoryId(request.categoryId())
                .description(normalize(request.description()))
                .amount(request.amount())
                .dueDate(request.dueDate())
                .status(ExpenseStatus.PENDING)
                .fixed(request.fixed())
                .createdAt(now)
                .updatedAt(now)
                .build();

        return toResponse(expenseRepository.save(expense));
    }

    public List<ExpenseResponse> findAll(Integer month, Integer year) {
        String userId = currentUserService.getCurrentUserId();
        List<ExpenseDocument> expenses;

        if (month != null && year != null) {
            YearMonth yearMonth = YearMonth.of(year, month);
            expenses = expenseRepository.findAllByUserIdAndDueDateBetween(
                    userId,
                    yearMonth.atDay(1),
                    yearMonth.atEndOfMonth()
            );
        } else {
            expenses = expenseRepository.findAllByUserId(userId);
        }

        return expenses.stream().map(this::toResponse).toList();
    }

    public ExpenseResponse findById(String expenseId) {
        String userId = currentUserService.getCurrentUserId();

        return expenseRepository.findByIdAndUserId(expenseId, userId)
                .map(this::toResponse)
                .orElseThrow(() -> new ExpenseNotFoundException(expenseId));
    }

    public ExpenseResponse update(String expenseId, ExpenseRequest request) {
        String userId = currentUserService.getCurrentUserId();
        ExpenseDocument expense = expenseRepository.findByIdAndUserId(expenseId, userId)
                .orElseThrow(() -> new ExpenseNotFoundException(expenseId));

        validateCategoryBelongsToUser(request.categoryId(), userId);

        expense.setCategoryId(request.categoryId());
        expense.setDescription(normalize(request.description()));
        expense.setAmount(request.amount());
        expense.setDueDate(request.dueDate());
        expense.setFixed(request.fixed());
        expense.setUpdatedAt(LocalDateTime.now());

        return toResponse(expenseRepository.save(expense));
    }

    public void delete(String expenseId) {
        String userId = currentUserService.getCurrentUserId();
        ExpenseDocument expense = expenseRepository.findByIdAndUserId(expenseId, userId)
                .orElseThrow(() -> new ExpenseNotFoundException(expenseId));

        expenseRepository.delete(expense);
    }

    public ExpenseResponse pay(String expenseId, PayExpenseRequest request) {
        String userId = currentUserService.getCurrentUserId();
        ExpenseDocument expense = expenseRepository.findByIdAndUserId(expenseId, userId)
                .orElseThrow(() -> new ExpenseNotFoundException(expenseId));

        expense.setPaidDate(request.paidDate());
        expense.setStatus(ExpenseStatus.PAID);
        expense.setUpdatedAt(LocalDateTime.now());

        return toResponse(expenseRepository.save(expense));
    }

    private void validateCategoryBelongsToUser(String categoryId, String userId) {
        if (categoryRepository.findByCategoryIdAndUserId(categoryId, userId).isEmpty()) {
            throw new CategoryNotFoundException(categoryId);
        }
    }

    private ExpenseResponse toResponse(ExpenseDocument expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getCategoryId(),
                expense.getDescription(),
                expense.getAmount(),
                expense.getDueDate(),
                expense.getPaidDate(),
                resolveStatus(expense),
                expense.isFixed(),
                expense.getCreatedAt(),
                expense.getUpdatedAt()
        );
    }

    private ExpenseStatus resolveStatus(ExpenseDocument expense) {
        if (expense.getStatus() == ExpenseStatus.PENDING && expense.getDueDate().isBefore(LocalDate.now())) {
            return ExpenseStatus.OVERDUE;
        }

        return expense.getStatus();
    }

    private String normalize(String value) {
        return value.trim();
    }
}
