package com.nicholas.freelacashflow.expense.controller;

import java.util.List;

import com.nicholas.freelacashflow.expense.dto.ExpenseRequest;
import com.nicholas.freelacashflow.expense.dto.ExpenseResponse;
import com.nicholas.freelacashflow.expense.dto.PayExpenseRequest;
import com.nicholas.freelacashflow.expense.service.ExpenseService;
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
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
@Tag(name = "Despesas", description = "Controle de despesas pendentes, pagas e vencidas do usuario autenticado.")
@SecurityRequirement(name = "bearerAuth")
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Criar despesa", description = "Cadastra uma despesa vinculada a uma categoria do usuario autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Despesa criada com sucesso."),
            @ApiResponse(responseCode = "400", description = "Payload invalido."),
            @ApiResponse(responseCode = "401", description = "JWT ausente ou invalido."),
            @ApiResponse(responseCode = "404", description = "Categoria nao encontrada para o usuario.")
    })
    public ExpenseResponse create(@RequestBody @Valid ExpenseRequest request) {
        return expenseService.create(request);
    }

    @GetMapping
    @Operation(summary = "Listar despesas", description = "Lista despesas do usuario autenticado. Quando mes e ano sao informados, filtra pela data de vencimento.")
    @ApiResponse(responseCode = "200", description = "Despesas retornadas com sucesso.")
    public List<ExpenseResponse> findAll(
            @Parameter(description = "Mes da data de vencimento, de 1 a 12.") @RequestParam(required = false) Integer month,
            @Parameter(description = "Ano da data de vencimento.") @RequestParam(required = false) Integer year
    ) {
        return expenseService.findAll(month, year);
    }

    @GetMapping("/{expenseId}")
    @Operation(summary = "Buscar despesa", description = "Retorna uma despesa pelo identificador quando ela pertence ao usuario autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Despesa encontrada."),
            @ApiResponse(responseCode = "404", description = "Despesa nao encontrada.")
    })
    public ExpenseResponse findById(@Parameter(description = "ID da despesa.") @PathVariable String expenseId) {
        return expenseService.findById(expenseId);
    }

    @PutMapping("/{expenseId}")
    @Operation(summary = "Atualizar despesa", description = "Atualiza categoria, descricao, valor, vencimento e recorrencia de uma despesa.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Despesa atualizada."),
            @ApiResponse(responseCode = "400", description = "Payload invalido."),
            @ApiResponse(responseCode = "404", description = "Despesa ou categoria nao encontrada.")
    })
    public ExpenseResponse update(
            @Parameter(description = "ID da despesa.") @PathVariable String expenseId,
            @RequestBody @Valid ExpenseRequest request
    ) {
        return expenseService.update(expenseId, request);
    }

    @DeleteMapping("/{expenseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Excluir despesa", description = "Remove uma despesa do usuario autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Despesa excluida."),
            @ApiResponse(responseCode = "404", description = "Despesa nao encontrada.")
    })
    public void delete(@Parameter(description = "ID da despesa.") @PathVariable String expenseId) {
        expenseService.delete(expenseId);
    }

    @PatchMapping("/{expenseId}/pay")
    @Operation(summary = "Marcar despesa como paga", description = "Define a data de pagamento e altera o status da despesa para PAID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Despesa marcada como paga."),
            @ApiResponse(responseCode = "400", description = "Payload invalido."),
            @ApiResponse(responseCode = "404", description = "Despesa nao encontrada.")
    })
    public ExpenseResponse pay(
            @Parameter(description = "ID da despesa.") @PathVariable String expenseId,
            @RequestBody @Valid PayExpenseRequest request
    ) {
        return expenseService.pay(expenseId, request);
    }
}
