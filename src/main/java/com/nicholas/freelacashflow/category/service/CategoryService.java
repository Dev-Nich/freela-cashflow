package com.nicholas.freelacashflow.category.service;

import java.time.LocalDateTime;
import java.util.List;

import com.nicholas.freelacashflow.category.document.CategoryDocument;
import com.nicholas.freelacashflow.category.dto.CategoryRequest;
import com.nicholas.freelacashflow.category.dto.CategoryResponse;
import com.nicholas.freelacashflow.category.exception.CategoryAlreadyExistsException;
import com.nicholas.freelacashflow.category.exception.CategoryNotFoundException;
import com.nicholas.freelacashflow.category.repository.CategoryRepository;
import com.nicholas.freelacashflow.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CurrentUserService currentUserService;

    public CategoryResponse create(CategoryRequest request) {
        String userId = currentUserService.getCurrentUserId();
        String name = normalizeName(request.name());

        validateCategoryNameIsAvailable(userId, name);

        LocalDateTime now = LocalDateTime.now();
        CategoryDocument category = CategoryDocument.builder()
                .userId(userId)
                .name(name)
                .description(normalizeDescription(request.description()))
                .createdAt(now)
                .updatedAt(now)
                .build();

        return toResponse(categoryRepository.save(category));
    }

    public List<CategoryResponse> findAll() {
        String userId = currentUserService.getCurrentUserId();

        return categoryRepository.findAllByUserId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoryResponse findById(String categoryId) {
        String userId = currentUserService.getCurrentUserId();

        return categoryRepository.findByCategoryIdAndUserId(categoryId, userId)
                .map(this::toResponse)
                .orElseThrow(() -> new CategoryNotFoundException(categoryId));
    }

    public CategoryResponse update(String categoryId, CategoryRequest request) {
        String userId = currentUserService.getCurrentUserId();
        CategoryDocument category = categoryRepository.findByCategoryIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new CategoryNotFoundException(categoryId));

        String name = normalizeName(request.name());
        if (!category.getName().equalsIgnoreCase(name)) {
            validateCategoryNameIsAvailable(userId, name);
        }

        category.setName(name);
        category.setDescription(normalizeDescription(request.description()));
        category.setUpdatedAt(LocalDateTime.now());

        return toResponse(categoryRepository.save(category));
    }

    public void delete(String categoryId) {
        String userId = currentUserService.getCurrentUserId();
        CategoryDocument category = categoryRepository.findByCategoryIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new CategoryNotFoundException(categoryId));

        categoryRepository.delete(category);
    }

    private void validateCategoryNameIsAvailable(String userId, String name) {
        if (categoryRepository.existsByUserIdAndNameIgnoreCase(userId, name)) {
            throw new CategoryAlreadyExistsException(name);
        }
    }

    private CategoryResponse toResponse(CategoryDocument category) {
        return new CategoryResponse(
                category.getCategoryId(),
                category.getName(),
                category.getDescription(),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }

    private String normalizeName(String name) {
        return name.trim();
    }

    private String normalizeDescription(String description) {
        if (description == null || description.isBlank()) {
            return null;
        }

        return description.trim();
    }
}
