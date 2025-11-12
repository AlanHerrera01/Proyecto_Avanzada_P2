package com.grupobb.biblioteca.controller;

import com.grupobb.biblioteca.domain.User;
import com.grupobb.biblioteca.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestionar usuarios.
 *
 * Endpoints:
 * - GET /api/users       -> lista todos los usuarios
 * - GET /api/users/{id}  -> obtiene un usuario por id
 * - POST /api/users      -> crea un usuario
 * - PUT /api/users/{id}  -> actualiza un usuario
 * - DELETE /api/users/{id} -> elimina un usuario
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Devuelve todos los usuarios en la BD.
     */
    @GetMapping
    public List<User> list() {
        return userRepository.findAll();
    }

    /**
     * Obtiene un usuario por su id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> get(@PathVariable Long id) {
        return userRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crea un nuevo usuario a partir del JSON enviado.
     */
    @PostMapping
    public User create(@RequestBody User user) {
        return userRepository.save(user);
    }

    /**
     * Actualiza un usuario existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User in) {
        return userRepository.findById(id).map(u -> {
            u.setNombre(in.getNombre());
            u.setEmail(in.getEmail());
            return ResponseEntity.ok(userRepository.save(u));
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Elimina un usuario por id.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return userRepository.findById(id).map(u -> {
            userRepository.delete(u);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
