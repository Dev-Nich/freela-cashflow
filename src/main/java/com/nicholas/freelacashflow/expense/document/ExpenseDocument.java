package com.nicholas.freelacashflow.expense.document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.nicholas.freelacashflow.expense.enums.ExpenseStatus;
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
@Document(collection = "expenses")
@CompoundIndex(name = "user_expense_due_date_idx", def = "{'userId': 1, 'dueDate': 1}")
public class ExpenseDocument {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String categoryId;

    private String description;

    private BigDecimal amount;

    private LocalDate dueDate;

    private LocalDate paidDate;

    private ExpenseStatus status;

    private boolean fixed;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
