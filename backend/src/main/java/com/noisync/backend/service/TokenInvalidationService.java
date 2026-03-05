package com.noisync.backend.service;

import com.noisync.backend.repository.EmailVerificationTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TokenInvalidationService {

    private final EmailVerificationTokenRepository tokenRepo;

    public TokenInvalidationService(EmailVerificationTokenRepository tokenRepo) {
        this.tokenRepo = tokenRepo;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void invalidateActiveTokens(Long userId) {
        tokenRepo.invalidateActiveTokens(userId);
    }
}