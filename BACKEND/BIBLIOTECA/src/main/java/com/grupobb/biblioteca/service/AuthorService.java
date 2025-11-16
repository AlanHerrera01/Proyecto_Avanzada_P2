package com.grupobb.biblioteca.service;

import com.grupobb.biblioteca.dto.Author.AuthorRequestData;
import com.grupobb.biblioteca.dto.Author.AuthorResponse;

import java.util.List;

public interface AuthorService {

    List<AuthorResponse> findAll();

    AuthorResponse findById(Long id);

    AuthorResponse create(AuthorRequestData request);

    AuthorResponse update(Long id, AuthorRequestData request);

    void delete(Long id);
}
