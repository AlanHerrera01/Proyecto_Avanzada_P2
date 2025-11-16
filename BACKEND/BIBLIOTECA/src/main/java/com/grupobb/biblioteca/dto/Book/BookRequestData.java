package com.grupobb.biblioteca.dto.Book;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BookRequestData {

    @NotBlank(message = "El título del libro es obligatorio")
    private String titulo;

    @NotNull(message = "El autorId es obligatorio")
    private Long autorId;

    // Opcional: permite controlar si el libro está disponible o no.
    // Si no quieres que el cliente lo maneje, puedes eliminar este campo
    // y manejar siempre disponible = true en el create.
    private Boolean disponible;

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public Long getAutorId() {
        return autorId;
    }

    public void setAutorId(Long autorId) {
        this.autorId = autorId;
    }

    public Boolean getDisponible() {
        return disponible;
    }

    public void setDisponible(Boolean disponible) {
        this.disponible = disponible;
    }
}
