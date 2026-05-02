package com.marvellous.MarvellousFullStack.Controller;

import com.marvellous.MarvellousFullStack.Entity.Announcement;
import com.marvellous.MarvellousFullStack.Repository.AnnouncementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/announcements")
@CrossOrigin(origins = "http://localhost:3000")
public class AnnouncementController {

    @Autowired
    private AnnouncementRepository announcementRepository;

    // GET all announcements — sorted pinned first then newest
    @GetMapping
    public ResponseEntity<List<Announcement>> getAll() {
        return ResponseEntity.ok(
                announcementRepository.findByOrderByPinnedDescCreatedAtDesc()
        );
    }

    // POST — create new announcement
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Announcement announcement) {
        announcement.setCreatedAt(LocalDateTime.now().toString());
        if (announcement.getDate() == null || announcement.getDate().isEmpty()) {
            announcement.setDate(LocalDate.now().toString());
        }
        Announcement saved = announcementRepository.save(announcement);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // PUT — update announcement
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Announcement announcement) {
        return announcementRepository.findById(id).map(existing -> {
            existing.setTitle(announcement.getTitle());
            existing.setMessage(announcement.getMessage());
            existing.setCategory(announcement.getCategory());
            existing.setDate(announcement.getDate());
            existing.setPinned(announcement.isPinned());
            return ResponseEntity.ok(announcementRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE — remove announcement
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        announcementRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Announcement deleted"));
    }

    // PATCH — toggle pinned status
    @PatchMapping("/{id}/pin")
    public ResponseEntity<?> togglePin(@PathVariable String id) {
        return announcementRepository.findById(id).map(existing -> {
            existing.setPinned(!existing.isPinned());
            return ResponseEntity.ok(announcementRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }
}