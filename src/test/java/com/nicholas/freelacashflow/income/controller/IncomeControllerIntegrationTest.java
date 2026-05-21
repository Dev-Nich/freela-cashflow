package com.nicholas.freelacashflow.income.controller;

import com.nicholas.freelacashflow.support.AbstractControllerIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class IncomeControllerIntegrationTest extends AbstractControllerIntegrationTest {

    @Test
    void shouldCreateFilterAndReceiveIncome() throws Exception {
        String token = registerAndGetToken("income-owner@email.com");

        MvcResult createResult = mockMvc.perform(post("/api/incomes")
                        .header("Authorization", authorization(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "description": " Projeto app ",
                                  "amount": 1500.00,
                                  "expectedDate": "2026-06-05",
                                  "source": " Cliente A "
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.description").value("Projeto app"))
                .andExpect(jsonPath("$.status").value("EXPECTED"))
                .andReturn();

        String incomeId = readJson(createResult).get("id").asText();

        mockMvc.perform(get("/api/incomes")
                        .header("Authorization", authorization(token))
                        .param("month", "6")
                        .param("year", "2026"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(incomeId));

        mockMvc.perform(patch("/api/incomes/{incomeId}/receive", incomeId)
                        .header("Authorization", authorization(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "receivedDate": "2026-06-06"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("RECEIVED"))
                .andExpect(jsonPath("$.receivedDate").value("2026-06-06"));
    }

    @Test
    void shouldValidateIncomePayload() throws Exception {
        String token = registerAndGetToken("invalid-income@email.com");

        mockMvc.perform(post("/api/incomes")
                        .header("Authorization", authorization(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "description": "",
                                  "amount": -1,
                                  "expectedDate": null
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fields.description").exists())
                .andExpect(jsonPath("$.fields.amount").exists())
                .andExpect(jsonPath("$.fields.expectedDate").exists());
    }
}
