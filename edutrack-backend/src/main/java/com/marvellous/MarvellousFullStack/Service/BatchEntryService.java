package com.marvellous.MarvellousFullStack.Service;

import com.marvellous.MarvellousFullStack.Entity.BatchEntry;
import com.marvellous.MarvellousFullStack.Repository.BatchEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class BatchEntryService
{
    @Autowired
    private BatchEntryRepository batchEntryRepository;

    // C : Create Post
    public void saveEntry(BatchEntry batchEntry)
    {
        batchEntryRepository.save(batchEntry);
    }

    // R : Read GET (all)
    public List<BatchEntry> getAll()
    {
        return batchEntryRepository.findAll();
    }

    // R : Read GET (by id)
    public Optional<BatchEntry> findById(String id)    // ✅ FIXED: String instead of ObjectId
    {
        return batchEntryRepository.findById(id);
    }

    // D : Delete DELETE
    public void deleteById(String id)                  // ✅ FIXED: String instead of ObjectId
    {
        batchEntryRepository.deleteById(id);
    }
}