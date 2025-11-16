package com.grupobb.biblioteca.service;

import com.grupobb.biblioteca.dto.Book.BookRequestData;
import com.grupobb.biblioteca.dto.Book.BookResponse;

import java.util.List;

public interface BookService {

    List<BookResponse> findAll();

    BookResponse findById(Long id);

    BookResponse create(BookRequestData request);

    BookResponse update(Long id, BookRequestData request);

    void delete(Long id);
}
