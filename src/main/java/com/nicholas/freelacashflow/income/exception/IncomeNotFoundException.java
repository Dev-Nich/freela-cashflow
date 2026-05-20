package com.nicholas.freelacashflow.income.exception;

public class IncomeNotFoundException extends RuntimeException {

    public IncomeNotFoundException(String incomeId) {
        super("Income not found: " + incomeId);
    }
}
