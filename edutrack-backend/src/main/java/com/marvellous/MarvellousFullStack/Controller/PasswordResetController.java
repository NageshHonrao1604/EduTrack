package com.marvellous.MarvellousFullStack.Controller;

import com.marvellous.MarvellousFullStack.Entity.PasswordResetToken;
import com.marvellous.MarvellousFullStack.Entity.User;
import com.marvellous.MarvellousFullStack.Repository.PasswordResetTokenRepository;
import com.marvellous.MarvellousFullStack.Repository.UserRepository;
import com.marvellous.MarvellousFullStack.Service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class PasswordResetController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ── STEP 1: Send OTP to email ────────────────────────────
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");

        if (email == null || email.isEmpty()) {
            return new ResponseEntity<>(Map.of("message", "Email is required"), HttpStatus.BAD_REQUEST);
        }

        // Check if user exists
        User user = userRepository.findByEmail(email);
        if (user == null) {
            // Don't reveal if email exists or not for security
            return ResponseEntity.ok(Map.of("message", "If this email exists, an OTP has been sent"));
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Delete any existing token for this email
        tokenRepository.deleteByEmail(email);

        // Save new token — expires in 10 minutes
        PasswordResetToken token = new PasswordResetToken();
        token.setEmail(email);
        token.setOtp(otp);
        token.setExpiryTime(System.currentTimeMillis() + 10 * 60 * 1000);
        tokenRepository.save(token);

        // Send OTP email
        try {
            emailService.sendOtpEmail(email, otp);
            return ResponseEntity.ok(Map.of("message", "OTP sent to your email"));
        } catch (Exception e) {
            return new ResponseEntity<>(
                    Map.of("message", "Failed to send email. Please try again."),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // ── STEP 2: Verify OTP ───────────────────────────────────
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");

        PasswordResetToken token = tokenRepository.findByEmailAndOtp(email, otp);

        if (token == null) {
            return new ResponseEntity<>(Map.of("message", "Invalid OTP"), HttpStatus.BAD_REQUEST);
        }

        if (token.isExpired()) {
            tokenRepository.delete(token);
            return new ResponseEntity<>(Map.of("message", "OTP has expired. Please request a new one."), HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok(Map.of("message", "OTP verified successfully"));
    }

    // ── STEP 3: Reset Password ───────────────────────────────
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");
        String newPassword = body.get("newPassword");

        if (newPassword == null || newPassword.length() < 6) {
            return new ResponseEntity<>(Map.of("message", "Password must be at least 6 characters"), HttpStatus.BAD_REQUEST);
        }

        // Verify OTP one more time
        PasswordResetToken token = tokenRepository.findByEmailAndOtp(email, otp);

        if (token == null || token.isExpired()) {
            return new ResponseEntity<>(Map.of("message", "Invalid or expired OTP"), HttpStatus.BAD_REQUEST);
        }

        // Update password
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return new ResponseEntity<>(Map.of("message", "User not found"), HttpStatus.NOT_FOUND);
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Delete used token
        tokenRepository.delete(token);

        return ResponseEntity.ok(Map.of("message", "Password reset successfully! You can now login."));
    }
}