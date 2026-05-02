package com.marvellous.MarvellousFullStack.Repository;

import com.marvellous.MarvellousFullStack.Entity.Announcement;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AnnouncementRepository extends MongoRepository<Announcement, String> {
    List<Announcement> findByOrderByPinnedDescCreatedAtDesc();
    List<Announcement> findByCategory(String category);
}