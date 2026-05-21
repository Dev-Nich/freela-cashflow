package com.nicholas.freelacashflow.expense.exception;

public class ExpenseNotFoundException extends RuntimeException {

    public ExpenseNotFoundException(String expenseId) {
        super("Expense not found: " + expenseId);
    }
}
