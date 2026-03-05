package com.noisync.backend.repository;

import com.noisync.backend.domain.Person;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonRepository extends JpaRepository<Person, Long> {
    boolean existsByCorreoIgnoreCase(String correo);
}