package com.grupobb.biblioteca.web.advice;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.http.ResponseEntity;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAll(Exception ex) {
        // Atrapa cualquier excepción no manejada y devuelve una respuesta 500 simple.
        // En una aplicación real podrías mapear distintas excepciones a códigos HTTP más precisos
        // y devolver un JSON con más detalles (timestamp, path, error code, etc.).
        return ResponseEntity.status(500).body("Error: " + ex.getMessage());
    }
}
