package com.nicholas.freelacashflow.expense.controller;

import java.util.List;

import com.nicholas.freelacashflow.expense.dto.ExpenseRequest;
import com.nicholas.freelacashflow.expense.dto.ExpenseResponse;
import com.nicholas.freelacashflow.expense.dto.PayExpenseRequest;
import com.nicholas.freelacashflow.expense.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExpenseResponse create(@RequestBody @Valid ExpenseRequest request) {
        return expenseService.create(request);
    }

    @GetMapping
    public List<ExpenseResponse> findAll(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year
    ) {
        return expenseService.findAll(month, year);
    }

    @GetMapping("/{expenseId}")
    public ExpenseResponse findById(@PathVariable String expenseId) {
        return expenseService.findById(expenseId);
    }

    @PutMapping("/{expenseId}")
    public ExpenseResponse update(
            @PathVariable String expenseId,
            @RequestBody @Valid ExpenseRequest request
    ) {
        return expenseService.update(expenseId, request);
    }

    @DeleteMapping("/{expenseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String expenseId) {
        expenseService.delete(expenseId);
    }

    @PatchMapping("/{expenseId}/pay")
    public ExpenseResponse pay(
            @PathVariable String expenseId,
            @RequestBody @Valid PayExpenseRequest request
    ) {
        return expenseService.pay(expenseId, request);
    }
}
