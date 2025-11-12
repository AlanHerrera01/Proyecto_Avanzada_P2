package com.grupobb.biblioteca.repository;

import com.grupobb.biblioteca.domain.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio para la entidad Loan (prestamos).
 */
public interface LoanRepository extends JpaRepository<Loan, Long> {
}
