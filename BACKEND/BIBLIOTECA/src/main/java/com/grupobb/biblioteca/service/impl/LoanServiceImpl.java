package com.grupobb.biblioteca.service.impl;

import com.grupobb.biblioteca.domain.Book;
import com.grupobb.biblioteca.domain.Loan;
import com.grupobb.biblioteca.domain.User;
import com.grupobb.biblioteca.dto.Loan.LoanRequestData;
import com.grupobb.biblioteca.dto.Loan.LoanResponse;
import com.grupobb.biblioteca.repository.BookRepository;
import com.grupobb.biblioteca.repository.LoanRepository;
import com.grupobb.biblioteca.repository.UserRepository;
import com.grupobb.biblioteca.service.LoanService;
import com.grupobb.biblioteca.service.subscriber.PrestamoSubscriber; // Importa tu nuevo subscriber
import com.grupobb.biblioteca.web.advice.AlreadyReturnedException;
import com.grupobb.biblioteca.web.advice.BookNotAvailableException;
import com.grupobb.biblioteca.web.advice.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux; // Importar Reactor
import reactor.core.scheduler.Schedulers; // Importar Schedulers

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;

@Service
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public LoanServiceImpl(LoanRepository loanRepository,
                           UserRepository userRepository,
                           BookRepository bookRepository) {
        this.loanRepository = loanRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    // ... (Mantén createLoan y returnLoan exactamente igual que antes) ...

    @Override
    public List<LoanResponse> list() {
        // 1. Obtener datos de la BD (Sincrónico, como siempre)
        List<Loan> loans = loanRepository.findAll();

        // 2. INTEGRACIÓN REACTIVA (Side-Effect)
        // Disparamos el análisis sin bloquear el retorno al frontend.
        // Esto imita la lógica de MainCafeApp.java pero con Préstamos.
        ejecutarAnalisisReactivo(loans);

        // 3. Retornar al frontend tal como espera (no rompemos nada)
        return loans.stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Método auxiliar que contiene toda la lógica .
     * Se ejecuta en segundo plano.
     */
    private void ejecutarAnalisisReactivo(List<Loan> loans) {
        Flux.fromIterable(loans)
                // Ejecutar en un pool de hilos alterno para no frenar la respuesta HTTP
                .subscribeOn(Schedulers.boundedElastic())

                // Simular retardo de procesamiento (del archivo MainCafeApp: .delayElements)
                // Lo bajamos a 100ms para que sea ágil en los logs
                .delayElements(Duration.ofMillis(100))

                // Filtro: Ejemplo, solo analizar préstamos que NO han sido devueltos
                // (Adaptación de: .filter(pedido -> pedido >= 5.00))
                .filter(loan -> loan.getFechaDevolucion() == null)

                // Map: Simular una validación o transformación
                // (Adaptación de la lógica de error si > 20.00)
                .map(loan -> {
                    // Simulemos un error si el usuario se llama "ErrorUser" (por ejemplo)
                    if ("ErrorUser".equals(loan.getUsuario().getNombre())) {
                        throw new RuntimeException("Usuario bloqueado detectado: " + loan.getUsuario().getNombre());
                    }
                    return loan;
                })

                // Manejo de errores (Adaptación de .onErrorResume)
                .onErrorResume(err -> {
                    System.out.println("[Reactive] Error en el flujo de préstamos: " + err.getMessage());
                    return Flux.empty(); // O retornar un flujo alternativo
                })

                // Suscripción usando tu clase personalizada
                .subscribe(new PrestamoSubscriber(2)); // Procesar en lotes de 2
    }

    // ... (Mantén getById y toResponse igual que antes) ...
    @Override
    @Transactional
    public LoanResponse createLoan(LoanRequestData request) {
        // ... tu código existente ...
        // (Copia tu código original aquí, no hace falta cambiarlo)
        // Simplemente asegúrate de que el resto de la clase siga igual.
        User user = userRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));

        Book book = bookRepository.findById(request.getLibroId())
                .orElseThrow(() -> new NotFoundException("Libro no encontrado"));

        if (!book.isDisponible()) {
            throw new BookNotAvailableException("El libro no está disponible");
        }

        Loan loan = new Loan();
        loan.setUsuario(user);
        loan.setLibro(book);
        loan.setFechaPrestamo(LocalDate.now());
        loan.setFechaDevolucion(null);

        book.setDisponible(false);
        bookRepository.save(book);

        Loan saved = loanRepository.save(loan);

        return toResponse(saved);
    }

    @Override
    @Transactional
    public LoanResponse returnLoan(Long loanId) {
        // ... tu código existente ...
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new NotFoundException("Préstamo no encontrado"));

        if (loan.getFechaDevolucion() != null) {
            throw new AlreadyReturnedException("El libro ya fue devuelto");
        }

        loan.setFechaDevolucion(LocalDate.now());

        Book book = loan.getLibro();
        book.setDisponible(true);
        bookRepository.save(book);

        Loan updated = loanRepository.save(loan);

        return toResponse(updated);
    }

    @Override
    public LoanResponse getById(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new NotFoundException("Préstamo no encontrado"));
        return toResponse(loan);
    }

    private LoanResponse toResponse(Loan loan) {
        LoanResponse r = new LoanResponse();
        r.setId(loan.getId());
        r.setUsuarioNombre(loan.getUsuario().getNombre());
        r.setLibroTitulo(loan.getLibro().getTitulo());
        r.setFechaPrestamo(loan.getFechaPrestamo());
        r.setFechaDevolucion(loan.getFechaDevolucion());
        return r;
    }
}