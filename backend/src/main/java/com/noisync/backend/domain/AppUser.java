package com.noisync.backend.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "APP_USER")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "USER_ID")
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PERSON_ID", nullable = false)
    private Person person;

    @Column(name = "BAND_ID", nullable = false)
    private Long bandId;

    @Column(name = "ROL", nullable = false)
    private String rol;

    @Column(name = "USERNAME")
    private String username;

    @Column(name = "PASSWORD_HASH", nullable = false)
    private String passwordHash;

    @Column(name = "ESTATUS", nullable = false)
    private String estatus;

    @Column(name = "PRIMER_LOGIN", nullable = false)
    private Integer primerLogin;

    @Column(name = "ACTIVO", nullable = false)
    private Integer activo;

    @Column(name = "FAILED_ATTEMPTS", nullable = false)
    private Integer failedAttempts;

    @Column(name = "LOCKED_UNTIL")
    private Instant lockedUntil;

    // ===== GETTERS / SETTERS =====
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Person getPerson() { return person; }
    public void setPerson(Person person) { this.person = person; }

    public Long getBandId() { return bandId; }
    public void setBandId(Long bandId) { this.bandId = bandId; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getEstatus() { return estatus; }
    public void setEstatus(String estatus) { this.estatus = estatus; }

    public Integer getPrimerLogin() { return primerLogin; }
    public void setPrimerLogin(Integer primerLogin) { this.primerLogin = primerLogin; }

    public Integer getActivo() { return activo; }
    public void setActivo(Integer activo) { this.activo = activo; }

    public Integer getFailedAttempts() { return failedAttempts; }
    public void setFailedAttempts(Integer failedAttempts) { this.failedAttempts = failedAttempts; }

    public Instant getLockedUntil() { return lockedUntil; }
    public void setLockedUntil(Instant lockedUntil) { this.lockedUntil = lockedUntil; }
}