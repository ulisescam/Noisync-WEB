package com.noisync.backend.security;

import com.noisync.backend.repository.AppUserRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final AppUserRepository userRepo;

    public JwtAuthFilter(JwtService jwtService, AppUserRepository userRepo) {
        this.jwtService = jwtService;
        this.userRepo = userRepo;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {
            Claims claims = jwtService.parse(token);
            Long userId = Long.valueOf(claims.getSubject());

            var user = userRepo.findById(userId).orElse(null);

            if (user == null ||
                    user.getActivo() == 0 ||
                    !"ACTIVO".equalsIgnoreCase(user.getEstatus())) {
                filterChain.doFilter(request, response);
                return;
            }

            String role = claims.get("role", String.class);
            Long bandId = ((Number) claims.get("bandId")).longValue();

            var authority = new SimpleGrantedAuthority("ROLE_" + role);

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            userId,
                            null,
                            List.of(authority)  //
                    );

            auth.setDetails(Map.of(
                    "bandId", bandId,
                    "primerLogin", claims.get("primerLogin", Integer.class)
            ));

            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (Exception ignored) {
        }

        filterChain.doFilter(request, response);
    }
}