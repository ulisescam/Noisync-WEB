package com.noisync.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Origen de tu front Vite
        config.setAllowedOrigins(List.of("http://localhost:5173"));

        // Métodos
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        // Headers permitidos (incluye Authorization para JWT)
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        // Headers expuestos (si algún día los necesitas)
        config.setExposedHeaders(List.of("Authorization"));

        // Si usas cookies/sesión (aquí NO lo ocupas, pero lo dejo correcto)
        config.setAllowCredentials(true);

        // Cache del preflight
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}