package com.nicholas.freelacashflow.category.repository;

import java.util.List;
import java.util.Optional;

import com.nicholas.freelacashflow.category.document.CategoryDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CategoryRepository extends MongoRepository<CategoryDocument, String> {

    List<CategoryDocument> findAllByUserId(String userId);

    Optional<CategoryDocument> findByCategoryIdAndUserId(String categoryId, String userId);

    boolean existsByUserIdAndNameIgnoreCase(String userId, String name);
}
