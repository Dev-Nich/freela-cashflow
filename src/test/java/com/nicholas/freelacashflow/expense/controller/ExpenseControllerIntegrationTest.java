package com.nicholas.freelacashflow.expense.controller;

import com.nicholas.freelacashflow.support.AbstractControllerIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ExpenseControllerIntegrationTest extends AbstractControllerIntegrationTest {

    @Test
    void shouldCreateFilterAndPayExpense() throws Exception {
        String token = registerAndGetToken("expense-owner@email.com");
        String categoryId = createCategory(token);

        MvcResult createResult = mockMvc.perform(post("/api/expenses")
                        .header("Authorization", authorization(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": "%s",
                                  "description": "Parcela do PC",
                                  "amount": 1000.00,
                                  "dueDate": "2026-06-17",
                                  "fixed": true
                                }
                                """.formatted(categoryId)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.categoryId").value(categoryId))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andReturn();

        String expenseId = readJson(createResult).get("id").asText();

        mockMvc.perform(get("/api/expenses")
                        .header("Authorization", authorization(token))
                        .param("month", "6")
                        .param("year", "2026"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(expenseId));

        mockMvc.perform(patch("/api/expenses/{expenseId}/pay", expenseId)
                        .header("Authorization", authorization(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "paidDate": "2026-06-17"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PAID"))
                .andExpect(jsonPath("$.paidDate").value("2026-06-17"));
    }

    @Test
    void shouldRejectExpenseWhenCategoryBelongsToAnotherUser() throws Exception {
        String firstToken = registerAndGetToken("category-source@email.com");
        String secondToken = registerAndGetToken("expense-rejected@email.com");
        String foreignCategoryId = createCategory(firstToken);

        mockMvc.perform(post("/api/expenses")
                        .header("Authorization", authorization(secondToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": "%s",
                                  "description": "Internet",
                                  "amount": 120.00,
                                  "dueDate": "2026-06-10",
                                  "fixed": true
                                }
                                """.formatted(foreignCategoryId)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Category not found: " + foreignCategoryId));
    }

    private String createCategory(String token) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/categories")
                        .header("Authorization", authorization(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Operacional",
                                  "description": "Custos operacionais"
                                }
                                """))
                .andExpect(status().isCreated())
                .andReturn();

        return readJson(result).get("id").asText();
    }
}
