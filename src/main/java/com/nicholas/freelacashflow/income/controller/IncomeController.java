package com.nicholas.freelacashflow.income.controller;

import java.util.List;

import com.nicholas.freelacashflow.income.dto.IncomeRequest;
import com.nicholas.freelacashflow.income.dto.IncomeResponse;
import com.nicholas.freelacashflow.income.dto.ReceiveIncomeRequest;
import com.nicholas.freelacashflow.income.service.IncomeService;
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
public class IncomeController {

    private final IncomeService incomeService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IncomeResponse create(@RequestBody @Valid IncomeRequest request) {
        return incomeService.create(request);
    }

    @GetMapping
    public List<IncomeResponse> findAll(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year
    ) {
        return incomeService.findAll(month, year);
    }

    @GetMapping("/{incomeId}")
    public IncomeResponse findById(@PathVariable String incomeId) {
        return incomeService.findById(incomeId);
    }

    @PutMapping("/{incomeId}")
    public IncomeResponse update(
            @PathVariable String incomeId,
            @RequestBody @Valid IncomeRequest request
    ) {
        return incomeService.update(incomeId, request);
    }

    @DeleteMapping("/{incomeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String incomeId) {
        incomeService.delete(incomeId);
    }

    @PatchMapping("/{incomeId}/receive")
    public IncomeResponse receive(
            @PathVariable String incomeId,
            @RequestBody @Valid ReceiveIncomeRequest request
    ) {
        return incomeService.receive(incomeId, request);
    }
}
