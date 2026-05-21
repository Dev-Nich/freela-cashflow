package com.nicholas.freelacashflow.income.document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.nicholas.freelacashflow.income.enums.IncomeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "incomes")
@CompoundIndex(name = "user_income_expected_date_idx", def = "{'userId': 1, 'expectedDate': 1}")
public class IncomeDocument {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String description;

    private BigDecimal amount;

    private LocalDate expectedDate;

    private LocalDate receivedDate;

    private IncomeStatus status;

    private String source;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
