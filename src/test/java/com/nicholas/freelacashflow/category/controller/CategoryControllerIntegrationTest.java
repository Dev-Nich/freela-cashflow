package com.nicholas.freelacashflow.category.controller;

import com.nicholas.freelacashflow.support.AbstractControllerIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class CategoryControllerIntegrationTest extends AbstractControllerIntegrationTest {

    @Test
    void shouldRequireAuthentication() throws Exception {
        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldCreateListUpdateAndDeleteCategory() throws Exception {
        String token = registerAndGetToken("category-owner@email.com");

        MvcResult createResult = mockMvc.perform(post("/api/categories")
                        .header("Authorization", authorization(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": " Equipamentos ",
                                  "description": " Ferramentas "
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Equipamentos"))
                .andExpect(jsonPath("$.description").value("Ferramentas"))
                .andReturn();

        String categoryId = readJson(createResult).get("id").asText();

        mockMvc.perform(get("/api/categories")
                        .header("Authorization", authorization(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(categoryId));

        mockMvc.perform(put("/api/categories/{categoryId}", categoryId)
                        .header("Authorization", authorization(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Software",
                                  "description": "Assinaturas"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Software"));

        mockMvc.perform(delete("/api/categories/{categoryId}", categoryId)
                        .header("Authorization", authorization(token)))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/categories/{categoryId}", categoryId)
                        .header("Authorization", authorization(token)))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldIsolateCategoriesByAuthenticatedUser() throws Exception {
        String firstToken = registerAndGetToken("first-category@email.com");
        String secondToken = registerAndGetToken("second-category@email.com");

        MvcResult createResult = mockMvc.perform(post("/api/categories")
                        .header("Authorization", authorization(firstToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Impostos",
                                  "description": "Guias mensais"
                                }
                                """))
                .andExpect(status().isCreated())
                .andReturn();

        String categoryId = readJson(createResult).get("id").asText();

        mockMvc.perform(get("/api/categories/{categoryId}", categoryId)
                        .header("Authorization", authorization(secondToken)))
                .andExpect(status().isNotFound());
    }
}
