package com.grupobb.biblioteca.controller;

import com.grupobb.biblioteca.domain.Book;
import com.grupobb.biblioteca.repository.BookRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para operaciones CRUD sobre libros.
 *
 * Rutas base: /api/books
 * - GET /api/books           -> lista todos los libros (incluye campo 'disponible')
 * - GET /api/books/{id}      -> obtiene un libro por id
 * - POST /api/books          -> crea un nuevo libro (envía JSON con titulo y autor)
 * - PUT /api/books/{id}      -> actualiza un libro existente
 * - DELETE /api/books/{id}   -> elimina un libro
 */
@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookRepository bookRepository;

    public BookController(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    /**
     * Devuelve la lista completa de libros.
     */
    @GetMapping
    public List<Book> list() {
        return bookRepository.findAll();
    }

    /**
     * Obtiene un libro por su id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Book> get(@PathVariable Long id) {
        return bookRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crea un nuevo libro a partir del payload JSON.
     * Nota: para enlazar un autor existente, envía el objeto author con su id: { "autor": { "id": 1 } }
     */
    @PostMapping
    public Book create(@RequestBody Book book) {
        return bookRepository.save(book);
    }

    /**
     * Actualiza campos básicos de un libro (titulo, autor, disponible).
     */
    @PutMapping("/{id}")
    public ResponseEntity<Book> update(@PathVariable Long id, @RequestBody Book in) {
        return bookRepository.findById(id).map(b -> {
            b.setTitulo(in.getTitulo());
            b.setAutor(in.getAutor());
            b.setDisponible(in.isDisponible());
            return ResponseEntity.ok(bookRepository.save(b));
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Elimina un libro por id.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return bookRepository.findById(id).map(b -> {
            bookRepository.delete(b);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
