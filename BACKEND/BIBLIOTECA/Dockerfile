# Etapa 1: Build
FROM gradle:8.4-jdk17 as build
# Directorio de trabajo principal
WORKDIR /app

# Copiar todo el contenido del repositorio al contenedor
COPY . .

# Cambiar al directorio específico del proyecto backend
WORKDIR /app/BACKEND/BIBLIOTECA

# Ahora los comandos se ejecutan en el contexto correcto donde sí existe gradlew
RUN chmod +x ./gradlew
RUN ./gradlew clean bootJar --no-daemon

# Etapa 2: Run
FROM eclipse-temurin:17-jdk
WORKDIR /app
# Actualizar la ruta para copiar el JAR desde la nueva ubicación de build
COPY --from=build /app/BACKEND/BIBLIOTECA/build/libs/*.jar app.jar
ENV SPRING_PROFILES_ACTIVE=render
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]