package com.nicholas.freelacashflow.category.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import com.nicholas.freelacashflow.category.document.CategoryDocument;
import com.nicholas.freelacashflow.category.dto.CategoryRequest;
import com.nicholas.freelacashflow.category.dto.CategoryResponse;
import com.nicholas.freelacashflow.category.exception.CategoryAlreadyExistsException;
import com.nicholas.freelacashflow.category.exception.CategoryNotFoundException;
import com.nicholas.freelacashflow.category.repository.CategoryRepository;
import com.nicholas.freelacashflow.security.CurrentUserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CurrentUserService currentUserService;

    @InjectMocks
    private CategoryService categoryService;

    @Test
    void shouldCreateCategoryForCurrentUser() {
        when(currentUserService.getCurrentUserId()).thenReturn("user-1");
        when(categoryRepository.existsByUserIdAndNameIgnoreCase("user-1", "Equipamentos")).thenReturn(false);
        when(categoryRepository.save(any(CategoryDocument.class))).thenAnswer(invocation -> {
            CategoryDocument category = invocation.getArgument(0);
            category.setCategoryId("category-1");
            return category;
        });

        CategoryResponse response = categoryService.create(new CategoryRequest(" Equipamentos ", " Ferramentas "));

        assertThat(response.id()).isEqualTo("category-1");
        assertThat(response.name()).isEqualTo("Equipamentos");
        assertThat(response.description()).isEqualTo("Ferramentas");

        ArgumentCaptor<CategoryDocument> captor = ArgumentCaptor.forClass(CategoryDocument.class);
        verify(categoryRepository).save(captor.capture());
        assertThat(captor.getValue().getUserId()).isEqualTo("user-1");
    }

    @Test
    void shouldRejectDuplicatedCategoryNameForSameUser() {
        when(currentUserService.getCurrentUserId()).thenReturn("user-1");
        when(categoryRepository.existsByUserIdAndNameIgnoreCase("user-1", "Equipamentos")).thenReturn(true);

        assertThatThrownBy(() -> categoryService.create(new CategoryRequest("Equipamentos", null)))
                .isInstanceOf(CategoryAlreadyExistsException.class);
    }

    @Test
    void shouldListOnlyCurrentUserCategories() {
        when(currentUserService.getCurrentUserId()).thenReturn("user-1");
        when(categoryRepository.findAllByUserId("user-1")).thenReturn(List.of(category("category-1", "user-1")));

        List<CategoryResponse> response = categoryService.findAll();

        assertThat(response).hasSize(1);
        assertThat(response.get(0).id()).isEqualTo("category-1");
    }

    @Test
    void shouldThrowWhenCategoryDoesNotBelongToCurrentUser() {
        when(currentUserService.getCurrentUserId()).thenReturn("user-1");
        when(categoryRepository.findByCategoryIdAndUserId("category-1", "user-1")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.findById("category-1"))
                .isInstanceOf(CategoryNotFoundException.class);
    }

    private CategoryDocument category(String categoryId, String userId) {
        return CategoryDocument.builder()
                .categoryId(categoryId)
                .userId(userId)
                .name("Equipamentos")
                .description("Ferramentas")
                .build();
    }
}
