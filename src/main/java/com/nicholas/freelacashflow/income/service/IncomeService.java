package com.nicholas.freelacashflow.income.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

import com.nicholas.freelacashflow.income.document.IncomeDocument;
import com.nicholas.freelacashflow.income.dto.IncomeRequest;
import com.nicholas.freelacashflow.income.dto.IncomeResponse;
import com.nicholas.freelacashflow.income.dto.ReceiveIncomeRequest;
import com.nicholas.freelacashflow.income.enums.IncomeStatus;
import com.nicholas.freelacashflow.income.exception.IncomeNotFoundException;
import com.nicholas.freelacashflow.income.repository.IncomeRepository;
import com.nicholas.freelacashflow.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final CurrentUserService currentUserService;

    public IncomeResponse create(IncomeRequest request) {
        String userId = currentUserService.getCurrentUserId();
        LocalDateTime now = LocalDateTime.now();

        IncomeDocument income = IncomeDocument.builder()
                .userId(userId)
                .description(normalize(request.description()))
                .amount(request.amount())
                .expectedDate(request.expectedDate())
                .status(IncomeStatus.EXPECTED)
                .source(normalizeNullable(request.source()))
                .createdAt(now)
                .updatedAt(now)
                .build();

        return toResponse(incomeRepository.save(income));
    }

    public List<IncomeResponse> findAll(Integer month, Integer year) {
        String userId = currentUserService.getCurrentUserId();
        List<IncomeDocument> incomes;

        if (month != null && year != null) {
            YearMonth yearMonth = YearMonth.of(year, month);
            incomes = incomeRepository.findAllByUserIdAndExpectedDateBetween(
                    userId,
                    yearMonth.atDay(1),
                    yearMonth.atEndOfMonth()
            );
        } else {
            incomes = incomeRepository.findAllByUserId(userId);
        }

        return incomes.stream().map(this::toResponse).toList();
    }

    public IncomeResponse findById(String incomeId) {
        String userId = currentUserService.getCurrentUserId();

        return incomeRepository.findByIdAndUserId(incomeId, userId)
                .map(this::toResponse)
                .orElseThrow(() -> new IncomeNotFoundException(incomeId));
    }

    public IncomeResponse update(String incomeId, IncomeRequest request) {
        String userId = currentUserService.getCurrentUserId();
        IncomeDocument income = incomeRepository.findByIdAndUserId(incomeId, userId)
                .orElseThrow(() -> new IncomeNotFoundException(incomeId));

        income.setDescription(normalize(request.description()));
        income.setAmount(request.amount());
        income.setExpectedDate(request.expectedDate());
        income.setSource(normalizeNullable(request.source()));
        income.setUpdatedAt(LocalDateTime.now());

        return toResponse(incomeRepository.save(income));
    }

    public void delete(String incomeId) {
        String userId = currentUserService.getCurrentUserId();
        IncomeDocument income = incomeRepository.findByIdAndUserId(incomeId, userId)
                .orElseThrow(() -> new IncomeNotFoundException(incomeId));

        incomeRepository.delete(income);
    }

    public IncomeResponse receive(String incomeId, ReceiveIncomeRequest request) {
        String userId = currentUserService.getCurrentUserId();
        IncomeDocument income = incomeRepository.findByIdAndUserId(incomeId, userId)
                .orElseThrow(() -> new IncomeNotFoundException(incomeId));

        income.setReceivedDate(request.receivedDate());
        income.setStatus(IncomeStatus.RECEIVED);
        income.setUpdatedAt(LocalDateTime.now());

        return toResponse(incomeRepository.save(income));
    }

    private IncomeResponse toResponse(IncomeDocument income) {
        return new IncomeResponse(
                income.getId(),
                income.getDescription(),
                income.getAmount(),
                income.getExpectedDate(),
                income.getReceivedDate(),
                income.getStatus(),
                income.getSource(),
                income.getCreatedAt(),
                income.getUpdatedAt()
        );
    }

    private String normalize(String value) {
        return value.trim();
    }

    private String normalizeNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}
