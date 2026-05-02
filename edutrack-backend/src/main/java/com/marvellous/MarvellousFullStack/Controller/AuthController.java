package com.marvellous.MarvellousFullStack.Controller;

import com.marvellous.MarvellousFullStack.Entity.BatchEntry;
import com.marvellous.MarvellousFullStack.Entity.User;
import com.marvellous.MarvellousFullStack.Repository.BatchEntryRepository;
import com.marvellous.MarvellousFullStack.Repository.UserRepository;
import com.marvellous.MarvellousFullStack.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BatchEntryRepository batchEntryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ── ADMIN REGISTER ───────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return new ResponseEntity<>(
                    Map.of("message", "Email already registered"),
                    HttpStatus.CONFLICT
            );
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("ADMIN"); // always admin on register
        userRepository.save(user);
        return new ResponseEntity<>(Map.of("message", "Registration successful"), HttpStatus.CREATED);
    }

    // ── ADMIN LOGIN ──────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User existing = null;

        if (user.getEmail() != null && !user.getEmail().isEmpty()) {
            existing = userRepository.findByEmail(user.getEmail());
        }
        if (existing == null && user.getUsername() != null && !user.getUsername().isEmpty()) {
            existing = userRepository.findByUsername(user.getUsername());
        }

        if (existing != null && passwordEncoder.matches(user.getPassword(), existing.getPassword())) {
            String token = jwtUtil.generateToken(existing.getEmail());
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "email", existing.getEmail(),
                    "username", existing.getUsername() != null ? existing.getUsername() : "",
                    "role", existing.getRole() != null ? existing.getRole() : "ADMIN"
            ));
        }

        return new ResponseEntity<>(
                Map.of("message", "Invalid credentials"),
                HttpStatus.UNAUTHORIZED
        );
    }

    // ── STUDENT LOGIN ────────────────────────────────────────────
    // Student logs in using their email (same email stored in BatchDetails)
    @PostMapping("/student-login")
    public ResponseEntity<?> studentLogin(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        if (email == null || password == null) {
            return new ResponseEntity<>(
                    Map.of("message", "Email and password are required"),
                    HttpStatus.BAD_REQUEST
            );
        }

        // Find student in users collection
        User existing = userRepository.findByEmail(email);

        if (existing != null && passwordEncoder.matches(password, existing.getPassword())
                && "STUDENT".equals(existing.getRole())) {

            // Find matching BatchEntry to get student profile
            BatchEntry profile = batchEntryRepository.findByEmail(email);

            String token = jwtUtil.generateToken(existing.getEmail());
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "email", existing.getEmail(),
                    "role", "STUDENT",
                    "studentId", profile != null ? profile.getId() : "",
                    "name", profile != null ? profile.getName() : existing.getEmail(),
                    "batch", profile != null ? profile.getBatch() : "",
                    "fees", profile != null ? profile.getFees() : 0,
                    "feeStatus", profile != null ? (profile.getFeeStatus() != null ? profile.getFeeStatus() : "PENDING") : "PENDING"
            ));
        }

        return new ResponseEntity<>(
                Map.of("message", "Invalid credentials or not a student account"),
                HttpStatus.UNAUTHORIZED
        );
    }

    // ── ADD STUDENT AS USER ──────────────────────────────────────
    // Admin calls this to give a student login access
    @PostMapping("/create-student")
    public ResponseEntity<?> createStudentUser(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        if (email == null || password == null) {
            return new ResponseEntity<>(
                    Map.of("message", "Email and password required"),
                    HttpStatus.BAD_REQUEST
            );
        }

        // Check if student already has login
        if (userRepository.findByEmail(email) != null) {
            return new ResponseEntity<>(
                    Map.of("message", "Student login already exists"),
                    HttpStatus.CONFLICT
            );
        }

        // Check if student exists in BatchDetails
        BatchEntry student = batchEntryRepository.findByEmail(email);
        if (student == null) {
            return new ResponseEntity<>(
                    Map.of("message", "No student found with this email in BatchDetails"),
                    HttpStatus.NOT_FOUND
            );
        }

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setUsername(student.getName());
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRole("STUDENT");
        userRepository.save(newUser);

        return ResponseEntity.ok(Map.of("message", "Student login created successfully"));
    }
}