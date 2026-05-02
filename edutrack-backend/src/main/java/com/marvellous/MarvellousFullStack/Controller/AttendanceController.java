package com.marvellous.MarvellousFullStack.Controller;

import com.marvellous.MarvellousFullStack.Entity.Attendance;
import com.marvellous.MarvellousFullStack.Repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/attendance")
@CrossOrigin(origins = "http://localhost:3000")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    // GET all attendance records for a specific date
    @GetMapping("/date/{date}")
    public ResponseEntity<List<Attendance>> getByDate(@PathVariable String date) {
        return ResponseEntity.ok(attendanceRepository.findByDate(date));
    }

    // GET all attendance records for a student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> getByStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(attendanceRepository.findByStudentId(studentId));
    }

    // POST — mark attendance for a student on a date
    @PostMapping
    public ResponseEntity<?> markAttendance(@RequestBody Attendance attendance) {
        // Check if already marked for this student on this date
        Attendance existing = attendanceRepository.findByStudentIdAndDate(
                attendance.getStudentId(), attendance.getDate()
        );
        if (existing != null) {
            // Update existing record
            existing.setStatus(attendance.getStatus());
            attendanceRepository.save(existing);
            return ResponseEntity.ok(existing);
        }
        Attendance saved = attendanceRepository.save(attendance);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // POST — mark attendance for multiple students at once (bulk)
    @PostMapping("/bulk")
    public ResponseEntity<?> markBulkAttendance(@RequestBody List<Attendance> records) {
        for (Attendance record : records) {
            Attendance existing = attendanceRepository.findByStudentIdAndDate(
                    record.getStudentId(), record.getDate()
            );
            if (existing != null) {
                existing.setStatus(record.getStatus());
                attendanceRepository.save(existing);
            } else {
                attendanceRepository.save(record);
            }
        }
        return ResponseEntity.ok(Map.of("message", "Attendance saved successfully"));
    }

    // GET attendance summary (present count) for a student
    @GetMapping("/summary/{studentId}")
    public ResponseEntity<?> getSummary(@PathVariable String studentId) {
        List<Attendance> all = attendanceRepository.findByStudentId(studentId);
        long present = all.stream().filter(a -> "PRESENT".equals(a.getStatus())).count();
        long total = all.size();
        double percentage = total > 0 ? (present * 100.0 / total) : 0;
        return ResponseEntity.ok(Map.of(
                "total", total,
                "present", present,
                "absent", total - present,
                "percentage", Math.round(percentage)
        ));
    }
}