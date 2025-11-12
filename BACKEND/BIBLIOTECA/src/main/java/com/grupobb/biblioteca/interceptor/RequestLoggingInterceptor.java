package com.grupobb.biblioteca.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class RequestLoggingInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // Registrar petición simple en stdout (útil en desarrollo)
        // Este interceptor se ejecuta antes de que el controlador maneje la petición.
        // Aquí sólo imprimimos método y URI para facilitar debugging.
        System.out.println("Incoming request: " + request.getMethod() + " " + request.getRequestURI());
        // Devolver true para permitir que la cadena de manejo continúe hacia el controlador.
        return true;
    }
}
