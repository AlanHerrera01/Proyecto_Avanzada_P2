package com.grupobb.biblioteca.controller;

import com.grupobb.biblioteca.domain.Author;
import com.grupobb.biblioteca.repository.AuthorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para operaciones CRUD sobre autores.
 *
 * Rutas base: /api/authors
 * - GET /api/authors           -> lista todos los autores
 * - GET /api/authors/{id}      -> obtiene un autor por id
 * - POST /api/authors          -> crea un nuevo autor (envía JSON con nombre y nacionalidad)
 * - PUT /api/authors/{id}      -> actualiza un autor existente
 * - DELETE /api/authors/{id}   -> elimina un autor
 */
@RestController
@RequestMapping("/api/authors")
public class AuthorController {

    private final AuthorRepository authorRepository;

    public AuthorController(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    /**
     * Devuelve la lista completa de autores.
     */
    @GetMapping
    public List<Author> list() {
        return authorRepository.findAll();
    }

    /**
     * Obtiene un autor por su id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Author> get(@PathVariable Long id) {
        return authorRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crea un nuevo autor a partir del payload JSON.
     */
    @PostMapping
    public Author create(@RequestBody Author author) {
        return authorRepository.save(author);
    }

    /**
     * Actualiza campos básicos de un autor existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Author> update(@PathVariable Long id, @RequestBody Author in) {
        return authorRepository.findById(id).map(a -> {
            a.setNombre(in.getNombre());
            a.setNacionalidad(in.getNacionalidad());
            return ResponseEntity.ok(authorRepository.save(a));
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Elimina un autor por id.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return authorRepository.findById(id).map(a -> {
            authorRepository.delete(a);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
