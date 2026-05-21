package com.nicholas.freelacashflow.expense.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.nicholas.freelacashflow.expense.document.ExpenseDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ExpenseRepository extends MongoRepository<ExpenseDocument, String> {

    List<ExpenseDocument> findAllByUserId(String userId);

    Optional<ExpenseDocument> findByIdAndUserId(String id, String userId);

    List<ExpenseDocument> findAllByUserIdAndDueDateBetween(String userId, LocalDate startDate, LocalDate endDate);
}
