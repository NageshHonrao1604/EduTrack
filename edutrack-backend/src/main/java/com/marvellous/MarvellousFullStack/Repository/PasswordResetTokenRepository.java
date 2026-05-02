package com.marvellous.MarvellousFullStack.Repository;

import com.marvellous.MarvellousFullStack.Entity.PasswordResetToken;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PasswordResetTokenRepository extends MongoRepository<PasswordResetToken, String> {
    PasswordResetToken findByEmail(String email);
    PasswordResetToken findByEmailAndOtp(String email, String otp);
    void deleteByEmail(String email);
}