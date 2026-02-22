package com.noisync.backend.repository;

import com.noisync.backend.domain.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByUsernameIgnoreCase(String username);

    @Query("""
           select u from AppUser u
           join u.person p
           where lower(p.correo) = lower(:correo)
           """)
    Optional<AppUser> findByCorreoIgnoreCase(String correo);
}