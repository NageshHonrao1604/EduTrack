package com.marvellous.MarvellousFullStack.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom("nagesh04@gmail.com");
        helper.setTo(toEmail);
        helper.setSubject("EduTrack - Password Reset OTP");

        String html = """
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                <div style="background: #4338ca; padding: 32px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 800;">🎓 EduTrack</h1>
                    <p style="color: #c7d2fe; margin: 8px 0 0; font-size: 14px;">Admin Portal</p>
                </div>
                <div style="padding: 40px 32px;">
                    <h2 style="color: #1e293b; font-size: 20px; margin: 0 0 8px;">Password Reset Request</h2>
                    <p style="color: #64748b; font-size: 14px; margin: 0 0 32px; line-height: 1.6;">
                        We received a request to reset your password. Use the OTP below to proceed.
                        This OTP is valid for <strong>10 minutes</strong>.
                    </p>
                    <div style="background: #f1f5f9; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
                        <p style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px;">Your OTP</p>
                        <p style="color: #4338ca; font-size: 40px; font-weight: 800; letter-spacing: 12px; margin: 0;">%s</p>
                    </div>
                    <p style="color: #94a3b8; font-size: 12px; margin: 0; line-height: 1.6;">
                        If you did not request a password reset, please ignore this email.
                        Your password will remain unchanged.
                    </p>
                </div>
                <div style="background: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">EduTrack Admin Portal &bull; Do not reply to this email</p>
                </div>
            </div>
        """.formatted(otp);

        helper.setText(html, true);
        mailSender.send(message);
    }
}