package com.nicholas.freelacashflow.income.controller;

import java.util.List;

import com.nicholas.freelacashflow.income.dto.IncomeRequest;
import com.nicholas.freelacashflow.income.dto.IncomeResponse;
import com.nicholas.freelacashflow.income.dto.ReceiveIncomeRequest;
import com.nicholas.freelacashflow.income.service.IncomeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/incomes")
@RequiredArgsConstructor
@Tag(name = "Receitas", description = "Controle de receitas previstas e recebidas do usuario autenticado.")
@SecurityRequirement(name = "bearerAuth")
public class IncomeController {

    private final IncomeService incomeService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Criar receita", description = "Cadastra uma receita prevista para o usuario autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Receita criada com sucesso."),
            @ApiResponse(responseCode = "400", description = "Payload invalido."),
            @ApiResponse(responseCode = "401", description = "JWT ausente ou invalido.")
    })
    public IncomeResponse create(@RequestBody @Valid IncomeRequest request) {
        return incomeService.create(request);
    }

    @GetMapping
    @Operation(summary = "Listar receitas", description = "Lista receitas do usuario autenticado. Quando mes e ano sao informados, filtra pela data prevista.")
    @ApiResponse(responseCode = "200", description = "Receitas retornadas com sucesso.")
    public List<IncomeResponse> findAll(
            @Parameter(description = "Mes da data prevista, de 1 a 12.") @RequestParam(required = false) Integer month,
            @Parameter(description = "Ano da data prevista.") @RequestParam(required = false) Integer year
    ) {
        return incomeService.findAll(month, year);
    }

    @GetMapping("/{incomeId}")
    @Operation(summary = "Buscar receita", description = "Retorna uma receita pelo identificador quando ela pertence ao usuario autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Receita encontrada."),
            @ApiResponse(responseCode = "404", description = "Receita nao encontrada.")
    })
    public IncomeResponse findById(@Parameter(description = "ID da receita.") @PathVariable String incomeId) {
        return incomeService.findById(incomeId);
    }

    @PutMapping("/{incomeId}")
    @Operation(summary = "Atualizar receita", description = "Atualiza descricao, valor, data prevista e origem de uma receita.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Receita atualizada."),
            @ApiResponse(responseCode = "400", description = "Payload invalido."),
            @ApiResponse(responseCode = "404", description = "Receita nao encontrada.")
    })
    public IncomeResponse update(
            @Parameter(description = "ID da receita.") @PathVariable String incomeId,
            @RequestBody @Valid IncomeRequest request
    ) {
        return incomeService.update(incomeId, request);
    }

    @DeleteMapping("/{incomeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Excluir receita", description = "Remove uma receita do usuario autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Receita excluida."),
            @ApiResponse(responseCode = "404", description = "Receita nao encontrada.")
    })
    public void delete(@Parameter(description = "ID da receita.") @PathVariable String incomeId) {
        incomeService.delete(incomeId);
    }

    @PatchMapping("/{incomeId}/receive")
    @Operation(summary = "Marcar receita como recebida", description = "Define a data de recebimento e altera o status da receita para RECEIVED.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Receita marcada como recebida."),
            @ApiResponse(responseCode = "400", description = "Payload invalido."),
            @ApiResponse(responseCode = "404", description = "Receita nao encontrada.")
    })
    public IncomeResponse receive(
            @Parameter(description = "ID da receita.") @PathVariable String incomeId,
            @RequestBody @Valid ReceiveIncomeRequest request
    ) {
        return incomeService.receive(incomeId, request);
    }
}
