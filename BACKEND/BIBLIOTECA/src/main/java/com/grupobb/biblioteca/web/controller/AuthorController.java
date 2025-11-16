package com.grupobb.biblioteca.web.controller;

import com.grupobb.biblioteca.dto.Author.AuthorRequestData;
import com.grupobb.biblioteca.dto.Author.AuthorResponse;
import com.grupobb.biblioteca.service.AuthorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

/**
 * Controlador REST para operaciones CRUD sobre autores.
 *
 * Rutas base: /api/authors
 * - GET    /api/authors         -> lista todos los autores
 * - GET    /api/authors/{id}    -> obtiene un autor por id
 * - POST   /api/authors         -> crea un nuevo autor
 * - PUT    /api/authors/{id}    -> actualiza un autor existente
 * - DELETE /api/authors/{id}    -> elimina un autor
 */
@RestController
@RequestMapping("/api/authors")
public class AuthorController {

    private final AuthorService authorService;

    public AuthorController(AuthorService authorService) {
        this.authorService = authorService;
    }

    // Lista todos los autores
    @GetMapping
    public List<AuthorResponse> list() {
        return authorService.findAll();
    }

    // Obtiene un autor por ID
    @GetMapping("/{id}")
    public ResponseEntity<AuthorResponse> get(@PathVariable Long id) {
        AuthorResponse author = authorService.findById(id);
        return ResponseEntity.ok(author);
    }

    // Crea un nuevo autor
    @PostMapping
    public ResponseEntity<AuthorResponse> create(@Valid @RequestBody AuthorRequestData request) {
        AuthorResponse created = authorService.create(request);
        // opcional: devolver Location en header
        return ResponseEntity
                .created(URI.create("/api/authors/" + created.getId()))
                .body(created);
    }

    // Actualiza un autor existente
    @PutMapping("/{id}")
    public ResponseEntity<AuthorResponse> update(@PathVariable Long id,
                                                 @Valid @RequestBody AuthorRequestData request) {
        AuthorResponse updated = authorService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    // Elimina un autor
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        authorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
