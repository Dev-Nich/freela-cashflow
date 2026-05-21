package com.nicholas.freelacashflow.category.controller;

import java.util.List;

import com.nicholas.freelacashflow.category.dto.CategoryRequest;
import com.nicholas.freelacashflow.category.dto.CategoryResponse;
import com.nicholas.freelacashflow.category.service.CategoryService;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Categorias", description = "Gerenciamento de categorias de despesas do usuario autenticado.")
@SecurityRequirement(name = "bearerAuth")
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Criar categoria", description = "Cadastra uma categoria de despesa para o usuario autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Categoria criada com sucesso."),
            @ApiResponse(responseCode = "400", description = "Payload invalido."),
            @ApiResponse(responseCode = "401", description = "JWT ausente ou invalido."),
            @ApiResponse(responseCode = "409", description = "Categoria ja cadastrada para o usuario.")
    })
    public CategoryResponse create(@RequestBody @Valid CategoryRequest request) {
        return categoryService.create(request);
    }

    @GetMapping
    @Operation(summary = "Listar categorias", description = "Retorna todas as categorias do usuario autenticado.")
    @ApiResponse(responseCode = "200", description = "Categorias retornadas com sucesso.")
    public List<CategoryResponse> findAll() {
        return categoryService.findAll();
    }

    @GetMapping("/{categoryId}")
    @Operation(summary = "Buscar categoria", description = "Retorna uma categoria pelo identificador quando ela pertence ao usuario autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categoria encontrada."),
            @ApiResponse(responseCode = "404", description = "Categoria nao encontrada.")
    })
    public CategoryResponse findById(@Parameter(description = "ID da categoria.") @PathVariable String categoryId) {
        return categoryService.findById(categoryId);
    }

    @PutMapping("/{categoryId}")
    @Operation(summary = "Atualizar categoria", description = "Atualiza nome e descricao de uma categoria do usuario autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categoria atualizada."),
            @ApiResponse(responseCode = "400", description = "Payload invalido."),
            @ApiResponse(responseCode = "404", description = "Categoria nao encontrada."),
            @ApiResponse(responseCode = "409", description = "Nome de categoria ja usado pelo usuario.")
    })
    public CategoryResponse update(
            @Parameter(description = "ID da categoria.") @PathVariable String categoryId,
            @RequestBody @Valid CategoryRequest request
    ) {
        return categoryService.update(categoryId, request);
    }

    @DeleteMapping("/{categoryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Excluir categoria", description = "Remove uma categoria do usuario autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Categoria excluida."),
            @ApiResponse(responseCode = "404", description = "Categoria nao encontrada.")
    })
    public void delete(@Parameter(description = "ID da categoria.") @PathVariable String categoryId) {
        categoryService.delete(categoryId);
    }
}
