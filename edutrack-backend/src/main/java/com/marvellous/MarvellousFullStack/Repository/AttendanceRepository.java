package com.marvellous.MarvellousFullStack.Repository;

import com.marvellous.MarvellousFullStack.Entity.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AttendanceRepository extends MongoRepository<Attendance, String> {
    List<Attendance> findByDate(String date);
    List<Attendance> findByStudentId(String studentId);
    List<Attendance> findByBatch(String batch);
    Attendance findByStudentIdAndDate(String studentId, String date);
}