package com.tothenew.journalApp.service;

import com.tothenew.journalApp.entity.JournalEntry;
import com.tothenew.journalApp.entity.User;
import com.tothenew.journalApp.repository.JournalEntryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.MongoTransactionManager;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
@RequiredArgsConstructor
@Service
@Slf4j
public class JournalEntryService {

//CONTROLLER --> SERVICE --> REPOSITORY
    /* @Autowired is an annotation used in Spring to automatically inject (or connect) one class into another */

    @Autowired
    private JournalEntryRepository journalEntryRepository ;
    @Autowired
    private UserService userService;



    /* the above 2 lines are basically means that
    * It tells Spring:
“Hey, I need an object of JournalEntryRepository here. Please create it and give it to me automatically. This is Known as Dependency injection ”
* without @Autowired we have to write  JournalEntryRepository journalEntryRepository = new JournalEntryRepository(); // Manual way (not preferred in Spring) */

    @Transactional
    public void saveEntry(JournalEntry journalEntry, String userName) throws Exception
    {
        try{
            User user = userService.findByUserName(userName);
            journalEntry.setDate(LocalDateTime.now());
            JournalEntry saved = journalEntryRepository.save(journalEntry);
            user.getJournalEntries().add(saved);
            userService.saveUser(user);
        }catch(Exception e)
        {
            log.error("Error faced during saving of Journal Entry");
            throw new Exception("Phatt Gaya Bhaiya !!");
        }
    }

//    this is the old journal entry update method
    public void saveEntry(JournalEntry journalEntry)
    {
        journalEntryRepository.save(journalEntry);
    }

    public List<JournalEntry> getAll()
    {
        return journalEntryRepository.findAll();
    }

    public Optional<JournalEntry> findById(ObjectId id)
    {
        return journalEntryRepository.findById(id);
    }

    @Transactional
    public boolean deleteByid(ObjectId id, String userName) throws Exception
    {
        boolean removed = false;
        try{

            User user = userService.findByUserName(userName);
            removed = user.getJournalEntries().removeIf(x->x.getId().equals(id));
            if(removed)
            {
                userService.saveUser(user); //saving updated user in the db
                journalEntryRepository.deleteById(id);
            }
        }
        catch (Exception e)
        {
            log.error("Failed to delete the JournalEntry");
            throw new Exception("Failed to Delete the JournalEntry");
        }
        return removed;
    }
}
