package com.noisync.backend.config;

import com.noisync.backend.security.JwtAuthFilter;
import com.noisync.backend.security.MustChangePasswordFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final MustChangePasswordFilter mustChangePasswordFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter, MustChangePasswordFilter mustChangePasswordFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.mustChangePasswordFilter = mustChangePasswordFilter;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // públicos
                        .requestMatchers(
                                "/api/health",
                                "/api/db-test",
                                "/api/auth/login",
                                "/api/auth/register-leader",
                                "/api/auth/accept-invite",
                                "/api/auth/change-password",
                                "/api/auth/verify",
                                "/api/auth/verify-email",
                                "/api/auth/resend-verification",
                                "/api/auth/forgot-password",
                                "/api/auth/reset-password",
                                "/api/auth/refresh",
                                "/api/auth/logout",

                                "/api/dev/**"
                        ).permitAll()

                        // ejemplo de RBAC (si tus endpoints de líder son estos)
                        .requestMatchers("/api/band/**", "/api/invite/**").hasRole("LEADER")

                        .anyRequest().authenticated()
                );

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterAfter(mustChangePasswordFilter, JwtAuthFilter.class);

        return http.build();
    }
}