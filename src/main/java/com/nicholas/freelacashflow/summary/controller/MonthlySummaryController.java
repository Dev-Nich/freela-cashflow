package com.nicholas.freelacashflow.summary.controller;

import com.nicholas.freelacashflow.summary.dto.MonthlySummaryResponse;
import com.nicholas.freelacashflow.summary.service.MonthlySummaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/monthly-summary")
@RequiredArgsConstructor
@Tag(name = "Resumo mensal", description = "Consolidacao mensal de receitas, despesas e saldos.")
@SecurityRequirement(name = "bearerAuth")
public class MonthlySummaryController {

    private final MonthlySummaryService monthlySummaryService;

    @GetMapping
    @Operation(summary = "Gerar resumo mensal", description = "Calcula receitas previstas e recebidas, despesas previstas e pagas, saldos e percentual comprometido do mes.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resumo calculado com sucesso."),
            @ApiResponse(responseCode = "400", description = "Mes ou ano invalido."),
            @ApiResponse(responseCode = "401", description = "JWT ausente ou invalido.")
    })
    public MonthlySummaryResponse generate(
            @Parameter(description = "Mes de referencia, de 1 a 12.", example = "6") @RequestParam @Min(1) @Max(12) int month,
            @Parameter(description = "Ano de referencia.", example = "2026") @RequestParam @Min(2000) int year
    ) {
        return monthlySummaryService.generate(month, year);
    }
}
