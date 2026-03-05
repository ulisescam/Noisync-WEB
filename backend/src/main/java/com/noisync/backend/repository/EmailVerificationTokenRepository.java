    package com.noisync.backend.repository;

    import com.noisync.backend.domain.EmailVerificationToken;
    import org.springframework.data.jpa.repository.*;
    import org.springframework.data.repository.query.Param;

    import java.util.Optional;

    public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {

        Optional<EmailVerificationToken> findByToken(String token);

        @Modifying
        @Query("update EmailVerificationToken t set t.used = 1 where t.user.userId = :userId and t.used = 0")
        int invalidateActiveTokens(@Param("userId") Long userId);
    }