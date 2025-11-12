package com.grupobb.biblioteca.repository;

import com.grupobb.biblioteca.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio para la entidad User.
 */
public interface UserRepository extends JpaRepository<User, Long> {
}
