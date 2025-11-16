package com.grupobb.biblioteca.service.impl;

import com.grupobb.biblioteca.domain.Author;
import com.grupobb.biblioteca.dto.Author.AuthorRequestData;
import com.grupobb.biblioteca.dto.Author.AuthorResponse;
import com.grupobb.biblioteca.repository.AuthorRepository;
import com.grupobb.biblioteca.service.AuthorService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository repository;

    public AuthorServiceImpl(AuthorRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<AuthorResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public AuthorResponse findById(Long id) {
        Author author = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Autor no encontrado con id " + id));
        return toResponse(author);
    }

    @Override
    public AuthorResponse create(AuthorRequestData request) {
        Author author = new Author();
        author.setNombre(request.getNombre());
        author.setNacionalidad(request.getNacionalidad());
        Author saved = repository.save(author);
        return toResponse(saved);
    }

    @Override
    public AuthorResponse update(Long id, AuthorRequestData request) {
        Author author = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Autor no encontrado con id " + id));

        author.setNombre(request.getNombre());
        author.setNacionalidad(request.getNacionalidad());

        Author updated = repository.save(author);
        return toResponse(updated);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Autor no encontrado con id " + id);
        }
        repository.deleteById(id);
    }

    // Mapper privado: Entity -> DTO
    private AuthorResponse toResponse(Author author) {
        AuthorResponse dto = new AuthorResponse();
        dto.setId(author.getId());
        dto.setNombre(author.getNombre());
        dto.setNacionalidad(author.getNacionalidad());
        return dto;
    }
}
