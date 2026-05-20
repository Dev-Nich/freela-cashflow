package com.nicholas.freelacashflow.income.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.nicholas.freelacashflow.income.document.IncomeDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface IncomeRepository extends MongoRepository<IncomeDocument, String> {

    List<IncomeDocument> findAllByUserId(String userId);

    Optional<IncomeDocument> findByIdAndUserId(String id, String userId);

    List<IncomeDocument> findAllByUserIdAndExpectedDateBetween(String userId, LocalDate startDate, LocalDate endDate);
}
