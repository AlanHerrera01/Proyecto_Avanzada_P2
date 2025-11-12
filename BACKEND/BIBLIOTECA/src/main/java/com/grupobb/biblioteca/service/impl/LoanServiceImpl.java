package com.grupobb.biblioteca.service.impl;

import com.grupobb.biblioteca.domain.Book;
import com.grupobb.biblioteca.domain.Loan;
import com.grupobb.biblioteca.domain.User;
import com.grupobb.biblioteca.repository.BookRepository;
import com.grupobb.biblioteca.repository.LoanRepository;
import com.grupobb.biblioteca.repository.UserRepository;
import com.grupobb.biblioteca.service.LoanService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public LoanServiceImpl(LoanRepository loanRepository, UserRepository userRepository, BookRepository bookRepository) {
        this.loanRepository = loanRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    @Transactional
    public Loan createLoan(Long userId, Long bookId) {
        // Buscar usuario y libro; lanzar RuntimeException si no existen.
        // En un proyecto real conviene usar excepciones custom (NotFoundException, BadRequestException, etc.).
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new RuntimeException("Libro no encontrado"));

        // Verificar disponibilidad del libro antes de crear el préstamo.
        if (!book.isDisponible()) {
            throw new RuntimeException("El libro no está disponible");
        }

        // Crear y persistir el préstamo. Utilizamos la fecha actual como fechaPrestamo.
        Loan loan = new Loan();
        loan.setUsuario(user);
        loan.setLibro(book);
        loan.setFechaPrestamo(LocalDate.now());
        loan.setFechaDevolucion(null);

        // Marcar libro como no disponible y guardar ambos cambios en la misma transacción.
        book.setDisponible(false);
        bookRepository.save(book);
        return loanRepository.save(loan);
    }

    @Override
    @Transactional
    public Loan returnLoan(Long loanId) {
        // Buscar el préstamo; si no existe, lanzar excepción.
        Loan loan = loanRepository.findById(loanId).orElseThrow(() -> new RuntimeException("Prestamo no encontrado"));

        // Evitar devolución duplicada.
        if (loan.getFechaDevolucion() != null) {
            throw new RuntimeException("El libro ya fue devuelto");
        }

        // Marcar fecha de devolución y volver a poner el libro como disponible.
        loan.setFechaDevolucion(LocalDate.now());
        Book book = loan.getLibro();
        book.setDisponible(true);
        bookRepository.save(book);
        return loanRepository.save(loan);
    }
}
