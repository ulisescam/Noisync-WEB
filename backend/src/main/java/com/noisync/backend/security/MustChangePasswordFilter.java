package com.noisync.backend.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;

@Component
public class MustChangePasswordFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        if (path.startsWith("/api/auth/change-password")
                || path.startsWith("/api/auth/logout")
                || path.startsWith("/api/auth/refresh")
                || path.startsWith("/api/health")) {
            chain.doFilter(request, response);
            return;
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.getDetails() instanceof Map<?, ?> details) {
            Object primerLogin = details.get("primerLogin");
            if (primerLogin instanceof Number n && n.intValue() == 1) {
                response.setStatus(403);
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.getWriter().write(
                        "{\"message\":\"Debes cambiar tu contraseña para continuar.\"}");
                return;
            }
        }

        chain.doFilter(request, response);
    }
}