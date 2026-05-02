package com.marvellous.MarvellousFullStack.Controller;

import com.marvellous.MarvellousFullStack.Entity.Mark;
import com.marvellous.MarvellousFullStack.Repository.MarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/marks")
@CrossOrigin(origins = "http://localhost:3000")
public class MarkController {

    @Autowired
    private MarkRepository markRepository;

    // GET all marks
    @GetMapping
    public ResponseEntity<List<Mark>> getAll() {
        return ResponseEntity.ok(markRepository.findAll());
    }

    // GET marks for a specific student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Mark>> getByStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(markRepository.findByStudentId(studentId));
    }

    // GET marks by batch
    @GetMapping("/batch/{batch}")
    public ResponseEntity<List<Mark>> getByBatch(@PathVariable String batch) {
        return ResponseEntity.ok(markRepository.findByBatch(batch));
    }

    // GET marks by exam type
    @GetMapping("/exam/{examType}")
    public ResponseEntity<List<Mark>> getByExamType(@PathVariable String examType) {
        return ResponseEntity.ok(markRepository.findByExamType(examType));
    }

    // POST — add mark for a student
    @PostMapping
    public ResponseEntity<?> addMark(@RequestBody Mark mark) {
        if (mark.getDate() == null || mark.getDate().isEmpty()) {
            mark.setDate(LocalDate.now().toString());
        }
        Mark saved = markRepository.save(mark);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // POST — bulk add marks for all students in a batch
    @PostMapping("/bulk")
    public ResponseEntity<?> addBulkMarks(@RequestBody List<Mark> marks) {
        marks.forEach(m -> {
            if (m.getDate() == null || m.getDate().isEmpty()) {
                m.setDate(LocalDate.now().toString());
            }
        });
        markRepository.saveAll(marks);
        return ResponseEntity.ok(Map.of("message", "Marks saved successfully"));
    }

    // PUT — update a mark
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMark(@PathVariable String id, @RequestBody Mark mark) {
        return markRepository.findById(id).map(existing -> {
            existing.setMarksObtained(mark.getMarksObtained());
            existing.setTotalMarks(mark.getTotalMarks());
            existing.setSubject(mark.getSubject());
            existing.setExamType(mark.getExamType());
            existing.setDate(mark.getDate());
            return ResponseEntity.ok(markRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE — remove a mark
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMark(@PathVariable String id) {
        markRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Mark deleted"));
    }
}