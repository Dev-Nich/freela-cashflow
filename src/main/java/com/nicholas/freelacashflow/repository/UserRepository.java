package com.nicholas.freelacashflow.repository;

import java.util.Optional;

import com.nicholas.freelacashflow.domain.document.UserDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<UserDocument, String> {

    Optional<UserDocument> findByEmail(String email);

    boolean existsByEmail(String email);
}
