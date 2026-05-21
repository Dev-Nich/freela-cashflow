package com.nicholas.freelacashflow.income.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.nicholas.freelacashflow.income.document.IncomeDocument;
import com.nicholas.freelacashflow.income.dto.IncomeRequest;
import com.nicholas.freelacashflow.income.dto.IncomeResponse;
import com.nicholas.freelacashflow.income.dto.ReceiveIncomeRequest;
import com.nicholas.freelacashflow.income.enums.IncomeStatus;
import com.nicholas.freelacashflow.income.exception.IncomeNotFoundException;
import com.nicholas.freelacashflow.income.repository.IncomeRepository;
import com.nicholas.freelacashflow.security.CurrentUserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class IncomeServiceTest {

    @Mock
    private IncomeRepository incomeRepository;

    @Mock
    private CurrentUserService currentUserService;

    @InjectMocks
    private IncomeService incomeService;

    @Test
    void shouldCreateExpectedIncomeForCurrentUser() {
        when(currentUserService.getCurrentUserId()).thenReturn("user-1");
        when(incomeRepository.save(any(IncomeDocument.class))).thenAnswer(invocation -> {
            IncomeDocument income = invocation.getArgument(0);
            income.setId("income-1");
            return income;
        });

        IncomeResponse response = incomeService.create(new IncomeRequest(
                " Projeto ",
                new BigDecimal("1500.00"),
                LocalDate.of(2026, 6, 5),
                " Cliente "
        ));

        assertThat(response.id()).isEqualTo("income-1");
        assertThat(response.description()).isEqualTo("Projeto");
        assertThat(response.source()).isEqualTo("Cliente");
        assertThat(response.status()).isEqualTo(IncomeStatus.EXPECTED);
    }

    @Test
    void shouldFilterIncomesByMonthAndYear() {
        when(currentUserService.getCurrentUserId()).thenReturn("user-1");
        when(incomeRepository.findAllByUserIdAndExpectedDateBetween(
                "user-1",
                LocalDate.of(2026, 6, 1),
                LocalDate.of(2026, 6, 30)
        )).thenReturn(List.of(income("income-1", IncomeStatus.EXPECTED)));

        List<IncomeResponse> response = incomeService.findAll(6, 2026);

        assertThat(response).hasSize(1);
        assertThat(response.get(0).id()).isEqualTo("income-1");
    }

    @Test
    void shouldMarkIncomeAsReceived() {
        IncomeDocument income = income("income-1", IncomeStatus.EXPECTED);
        when(currentUserService.getCurrentUserId()).thenReturn("user-1");
        when(incomeRepository.findByIdAndUserId("income-1", "user-1")).thenReturn(Optional.of(income));
        when(incomeRepository.save(income)).thenReturn(income);

        IncomeResponse response = incomeService.receive(
                "income-1",
                new ReceiveIncomeRequest(LocalDate.of(2026, 6, 6))
        );

        assertThat(response.status()).isEqualTo(IncomeStatus.RECEIVED);
        assertThat(response.receivedDate()).isEqualTo(LocalDate.of(2026, 6, 6));
    }

    @Test
    void shouldThrowWhenIncomeDoesNotBelongToCurrentUser() {
        when(currentUserService.getCurrentUserId()).thenReturn("user-1");
        when(incomeRepository.findByIdAndUserId("income-1", "user-1")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> incomeService.findById("income-1"))
                .isInstanceOf(IncomeNotFoundException.class);
    }

    private IncomeDocument income(String id, IncomeStatus status) {
        return IncomeDocument.builder()
                .id(id)
                .userId("user-1")
                .description("Projeto")
                .amount(new BigDecimal("1500.00"))
                .expectedDate(LocalDate.of(2026, 6, 5))
                .status(status)
                .source("Cliente")
                .build();
    }
}
