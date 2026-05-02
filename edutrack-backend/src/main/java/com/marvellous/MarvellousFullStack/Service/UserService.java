package com.marvellous.MarvellousFullStack.Service;

import com.marvellous.MarvellousFullStack.Entity.User;
import com.marvellous.MarvellousFullStack.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User register(User user) {
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        User existing = userRepository.findByEmail(email);

        if (existing != null && existing.getPassword().equals(password)) {
            return existing;
        }
        return null;
    }
}