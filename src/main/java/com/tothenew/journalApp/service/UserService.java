package com.tothenew.journalApp.service;

import com.tothenew.journalApp.entity.JournalEntry;
import com.tothenew.journalApp.entity.User;
import com.tothenew.journalApp.repository.JournalEntryRepository;
import com.tothenew.journalApp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Slf4j
public class UserService {

//CONTROLLER --> SERVICE --> REPOSITORY
    /* @Autowired is an annotation used in Spring to automatically inject (or connect) one class into another */


    private final UserRepository userRepository;

    private static  final Logger logger = LoggerFactory.getLogger(UserService.class);

    /* the above 2 lines are basically means that
    * It tells Spring:
“Hey, I need an object of JournalEntryRepository here. Please create it and give it to me automatically. This is Known as Dependency injection ”
* without @Autowired we have to write  JournalEntryRepository journalEntryRepository = new JournalEntryRepository(); // Manual way (not preferred in Spring) */

    private static  final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public void saveNewUser(User user)
    {
        try{
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setRoles(Arrays.asList("USER"));
            userRepository.save(user);
        } catch (Exception e) {
            logger.error("Failed to save new user/ Duplicate User {} : {}", user.getUserName(), e.getMessage(), e);
            throw new RuntimeException("Failed to save new user: " + e.getMessage(), e);
        }
    }

    public void saveUser(User user)
    {
        userRepository.save(user);
    }

    public void saveAdmin(User user)
    {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(Arrays.asList("USER", "ADMIN"));
        userRepository.save(user);
    }

    public List<User> getAll()
    {
        return userRepository.findAll();
    }

    public Optional<User> findById(ObjectId id)
    {
        return userRepository.findById(id);
    }

    public void deleteById(ObjectId id)
    {
        userRepository.deleteById(id);
    }

    public User findByUserName(String userName)
    {
        return userRepository.findByUserName(userName);
    }

}
