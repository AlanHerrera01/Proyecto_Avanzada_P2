package com.grupobb.biblioteca.dto.Author;

import jakarta.validation.constraints.NotBlank;

public class AuthorRequestData {

    @NotBlank(message = "El nombre del autor es obligatorio")
    private String nombre;

    // Nacionalidad opcional
    private String nacionalidad;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getNacionalidad() {
        return nacionalidad;
    }

    public void setNacionalidad(String nacionalidad) {
        this.nacionalidad = nacionalidad;
    }
}
