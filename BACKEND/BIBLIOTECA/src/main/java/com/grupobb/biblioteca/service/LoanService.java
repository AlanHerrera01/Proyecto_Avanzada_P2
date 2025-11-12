package com.grupobb.biblioteca.service;

import com.grupobb.biblioteca.domain.Loan;

/**
 * Contrato (interface) para la lógica de préstamos.
 * La implementación concreta se encuentra en el paquete service.impl
 */
public interface LoanService {
    /**
     * Crea un préstamo entre un usuario y un libro.
     * @param userId id del usuario
     * @param bookId id del libro
     * @return la entidad Loan creada
     */
    Loan createLoan(Long userId, Long bookId);

    /**
     * Marca un préstamo como devuelto.
     * @param loanId id del préstamo
     * @return la entidad Loan actualizada
     */
    Loan returnLoan(Long loanId);
}
