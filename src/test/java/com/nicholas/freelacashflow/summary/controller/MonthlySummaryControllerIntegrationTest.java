package com.nicholas.freelacashflow.summary.controller;

import com.nicholas.freelacashflow.support.AbstractControllerIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class MonthlySummaryControllerIntegrationTest extends AbstractControllerIntegrationTest {

    @Test
    void shouldGenerateMonthlySummaryFromPersistedIncomesAndExpenses() throws Exception {
        String token = registerAndGetToken("summary-owner@email.com");
        String categoryId = createCategory(token);
        String receivedIncomeId = createIncome(token, "Parcela recebida", "1500.00", "2026-06-05");
        createIncome(token, "Parcela prevista", "1500.00", "2026-06-20");
        String paidExpenseId = createExpense(token, categoryId, "Parcela do PC", "1000.00", "2026-06-17");
        createExpense(token, categoryId, "Software", "200.00", "2026-06-25");

        mockMvc.perform(patch("/api/incomes/{incomeId}/receive", receivedIncomeId)
                        .header("Authorization", authorization(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "receivedDate": "2026-06-06"
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/api/expenses/{expenseId}/pay", paidExpenseId)
                        .header("Authorization", authorization(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "paidDate": "2026-06-17"
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/monthly-summary")
                        .header("Authorization", authorization(token))
                        .param("month", "6")
                        .param("year", "2026"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.expectedIncome").value(3000.0))
                .andExpect(jsonPath("$.receivedIncome").value(1500.0))
                .andExpect(jsonPath("$.expectedExpenses").value(1200.0))
                .andExpect(jsonPath("$.paidExpenses").value(1000.0))
                .andExpect(jsonPath("$.pendingExpenses").value(200.0))
                .andExpect(jsonPath("$.expectedBalance").value(1800.0))
                .andExpect(jsonPath("$.realBalance").value(500.0))
                .andExpect(jsonPath("$.committedIncomePercentage").value(40.0));
    }

    @Test
    void shouldValidateSummaryParameters() throws Exception {
        String token = registerAndGetToken("summary-validation@email.com");

        mockMvc.perform(get("/api/monthly-summary")
                        .header("Authorization", authorization(token))
                        .param("month", "13")
                        .param("year", "1999"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
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

    private String createIncome(String token, String description, String amount, String expectedDate) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/incomes")
                        .header("Authorization", authorization(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "description": "%s",
                                  "amount": %s,
                                  "expectedDate": "%s",
                                  "source": "Cliente"
                                }
                                """.formatted(description, amount, expectedDate)))
                .andExpect(status().isCreated())
                .andReturn();

        return readJson(result).get("id").asText();
    }

    private String createExpense(String token, String categoryId, String description, String amount, String dueDate) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/expenses")
                        .header("Authorization", authorization(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": "%s",
                                  "description": "%s",
                                  "amount": %s,
                                  "dueDate": "%s",
                                  "fixed": false
                                }
                                """.formatted(categoryId, description, amount, dueDate)))
                .andExpect(status().isCreated())
                .andReturn();

        return readJson(result).get("id").asText();
    }
}
