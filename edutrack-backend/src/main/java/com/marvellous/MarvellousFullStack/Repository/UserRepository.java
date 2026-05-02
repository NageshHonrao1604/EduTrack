package com.marvellous.MarvellousFullStack.Repository;

import com.marvellous.MarvellousFullStack.Entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {

    User findByEmail(String email);

    User findByUsername(String username);   // ✅ ADDED — needed for login by username
}