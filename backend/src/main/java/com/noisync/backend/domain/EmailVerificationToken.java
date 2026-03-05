package com.noisync.backend.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "EMAIL_VERIFICATION_TOKEN")
public class EmailVerificationToken extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "USER_ID", nullable = false)
    private AppUser user;

    @Column(name = "TOKEN", nullable = false, unique = true, length = 120)
    private String token;

    @Column(name = "EXPIRES_AT", nullable = false)
    private LocalDateTime expiresAt;  // ← cambiado

    @Column(name = "USED", nullable = false)
    private Integer used;

    public Long getId() { return id; }

    public AppUser getUser() { return user; }
    public void setUser(AppUser user) { this.user = user; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public Integer getUsed() { return used; }
    public void setUsed(Integer used) { this.used = used; }
}