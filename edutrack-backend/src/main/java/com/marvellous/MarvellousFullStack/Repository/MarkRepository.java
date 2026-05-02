package com.marvellous.MarvellousFullStack.Repository;

import com.marvellous.MarvellousFullStack.Entity.Mark;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MarkRepository extends MongoRepository<Mark, String> {
    List<Mark> findByStudentId(String studentId);
    List<Mark> findByBatch(String batch);
    List<Mark> findByExamType(String examType);
    List<Mark> findByStudentIdAndExamType(String studentId, String examType);
}