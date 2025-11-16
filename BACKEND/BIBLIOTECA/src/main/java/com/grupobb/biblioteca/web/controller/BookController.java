package com.grupobb.biblioteca.web.controller;

import com.grupobb.biblioteca.dto.Book.BookRequestData;
import com.grupobb.biblioteca.dto.Book.BookResponse;
import com.grupobb.biblioteca.service.BookService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

/**
 * Controlador REST para operaciones CRUD sobre libros.
 *
 * Rutas base: /api/books
 * - GET    /api/books         -> lista todos los libros (incluye campo 'disponible')
 * - GET    /api/books/{id}    -> obtiene un libro por id
 * - POST   /api/books         -> crea un nuevo libro
 * - PUT    /api/books/{id}    -> actualiza un libro existente
 * - DELETE /api/books/{id}    -> elimina un libro
 */
@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // Lista todos los libros
    @GetMapping
    public List<BookResponse> list() {
        return bookService.findAll();
    }

    // Obtiene un libro por ID
    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> get(@PathVariable Long id) {
        BookResponse book = bookService.findById(id);
        return ResponseEntity.ok(book);
    }

    // Crea un nuevo libro
    @PostMapping
    public ResponseEntity<BookResponse> create(@Valid @RequestBody BookRequestData request) {
        BookResponse created = bookService.create(request);
        return ResponseEntity
                .created(URI.create("/api/books/" + created.getId()))
                .body(created);
    }

    // Actualiza un libro existente
    @PutMapping("/{id}")
    public ResponseEntity<BookResponse> update(@PathVariable Long id,
                                               @Valid @RequestBody BookRequestData request) {
        BookResponse updated = bookService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    // Elimina un libro
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
