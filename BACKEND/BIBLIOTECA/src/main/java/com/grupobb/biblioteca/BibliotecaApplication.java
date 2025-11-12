package com.grupobb.biblioteca;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BibliotecaApplication {
	/**
	 * Punto de entrada de la aplicación Spring Boot.
	 * Al ejecutar, Spring inicializa el contexto, componentes y servidor embebido (Tomcat por defecto).
	 * Mantener minimal: no se requiere configuración adicional aquí.
	 *
	 * @param args argumentos de la JVM (no utilizados aquí)
	 */
	public static void main(String[] args) {
		SpringApplication.run(BibliotecaApplication.class, args);
	}

}
