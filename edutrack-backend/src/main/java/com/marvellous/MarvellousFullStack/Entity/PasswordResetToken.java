package com.marvellous.MarvellousFullStack.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "PasswordResetTokens")
public class PasswordResetToken {

    @Id
    private String id;
    private String email;
    private String otp;
    private long expiryTime; // System.currentTimeMillis() + 10 minutes

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }

    public long getExpiryTime() { return expiryTime; }
    public void setExpiryTime(long expiryTime) { this.expiryTime = expiryTime; }

    public boolean isExpired() {
        return System.currentTimeMillis() > expiryTime;
    }
}