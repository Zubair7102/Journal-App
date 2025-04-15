package com.tothenew.journalApp.service;

import com.tothenew.journalApp.entity.JournalEntry;
import com.tothenew.journalApp.entity.User;
import com.tothenew.journalApp.repository.JournalEntryRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Component
public class UserService {

//CONTROLLER --> SERVICE --> REPOSITORY
    /* @Autowired is an annotation used in Spring to automatically inject (or connect) one class into another */


    private final UserService userRepository;

    /* the above 2 lines are basically means that
    * It tells Spring:
“Hey, I need an object of JournalEntryRepository here. Please create it and give it to me automatically. This is Known as Dependency injection ”
* without @Autowired we have to write  JournalEntryRepository journalEntryRepository = new JournalEntryRepository(); // Manual way (not preferred in Spring) */

    public void saveEntry(User user)
    {
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

    public void deleteByid(ObjectId id)
    {
        userRepository.deleteById(id);
    }

}
