package com.nicholas.freelacashflow.summary.controller;

import com.nicholas.freelacashflow.summary.dto.MonthlySummaryResponse;
import com.nicholas.freelacashflow.summary.service.MonthlySummaryService;
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
public class MonthlySummaryController {

    private final MonthlySummaryService monthlySummaryService;

    @GetMapping
    public MonthlySummaryResponse generate(
            @RequestParam @Min(1) @Max(12) int month,
            @RequestParam @Min(2000) int year
    ) {
        return monthlySummaryService.generate(month, year);
    }
}
