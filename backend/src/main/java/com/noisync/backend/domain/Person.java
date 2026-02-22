package com.noisync.backend.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "PERSON")
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PERSON_ID")
    private Long personId;

    @Column(name = "CORREO", nullable = false)
    private String correo;

    public Long getPersonId() { return personId; }
    public void setPersonId(Long personId) { this.personId = personId; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
}