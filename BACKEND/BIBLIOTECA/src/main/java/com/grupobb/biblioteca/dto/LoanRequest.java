package com.grupobb.biblioteca.dto;

public class LoanRequest {
    private Long usuarioId;
    private Long libroId;

    // DTO sencillo para recibir peticiones de préstamo desde el cliente.
    // Contiene únicamente los ids de usuario y libro para crear el préstamo.
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public Long getLibroId() { return libroId; }
    public void setLibroId(Long libroId) { this.libroId = libroId; }
}
