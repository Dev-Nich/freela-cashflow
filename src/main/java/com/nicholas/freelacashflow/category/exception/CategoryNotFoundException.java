package com.nicholas.freelacashflow.category.exception;

public class CategoryNotFoundException extends RuntimeException {

    public CategoryNotFoundException(String categoryId) {
        super("Category not found: " + categoryId);
    }
}
