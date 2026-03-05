package com.noisync.backend.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "REFRESH_TOKEN")
public class RefreshToken extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "USER_ID", nullable = false)
    private AppUser user;

    @Column(name = "TOKEN_HASH", nullable = false, unique = true, length = 128)
    private String tokenHash;

    @Column(name = "EXPIRES_AT", nullable = false)
    private LocalDateTime expiresAt;



    @Column(name = "REVOKED", nullable = false)
    private Integer revoked; // 0/1

    public Long getId() { return id; }

    public AppUser getUser() { return user; }
    public void setUser(AppUser user) { this.user = user; }

    public String getTokenHash() { return tokenHash; }
    public void setTokenHash(String tokenHash) { this.tokenHash = tokenHash; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public Integer getRevoked() { return revoked; }
    public void setRevoked(Integer revoked) { this.revoked = revoked; }
}