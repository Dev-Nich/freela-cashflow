package com.nicholas.freelacashflow.category.controller;

import java.util.List;

import com.nicholas.freelacashflow.category.dto.CategoryRequest;
import com.nicholas.freelacashflow.category.dto.CategoryResponse;
import com.nicholas.freelacashflow.category.service.CategoryService;
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
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse create(@RequestBody @Valid CategoryRequest request) {
        return categoryService.create(request);
    }

    @GetMapping
    public List<CategoryResponse> findAll() {
        return categoryService.findAll();
    }

    @GetMapping("/{categoryId}")
    public CategoryResponse findById(@PathVariable String categoryId) {
        return categoryService.findById(categoryId);
    }

    @PutMapping("/{categoryId}")
    public CategoryResponse update(
            @PathVariable String categoryId,
            @RequestBody @Valid CategoryRequest request
    ) {
        return categoryService.update(categoryId, request);
    }

    @DeleteMapping("/{categoryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String categoryId) {
        categoryService.delete(categoryId);
    }
}
