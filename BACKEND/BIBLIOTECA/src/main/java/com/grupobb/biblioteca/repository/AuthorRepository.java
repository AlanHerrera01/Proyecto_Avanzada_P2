package com.grupobb.biblioteca.repository;

import com.grupobb.biblioteca.domain.Author;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio Spring Data para la entidad Author.
 * Extiende JpaRepository para obtener operaciones CRUD básicas sin implementación manual.
 */
public interface AuthorRepository extends JpaRepository<Author, Long> {
}
