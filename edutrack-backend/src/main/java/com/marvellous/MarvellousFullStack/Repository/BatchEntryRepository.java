package com.marvellous.MarvellousFullStack.Repository;

import com.marvellous.MarvellousFullStack.Entity.BatchEntry;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BatchEntryRepository extends MongoRepository<BatchEntry, String> {
    BatchEntry findByEmail(String email);
    List<BatchEntry> findByBatch(String batch);
}