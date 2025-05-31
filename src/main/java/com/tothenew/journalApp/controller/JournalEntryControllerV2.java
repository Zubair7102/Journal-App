package com.tothenew.journalApp.controller;

import com.tothenew.journalApp.entity.JournalEntry;
import com.tothenew.journalApp.entity.User;
import com.tothenew.journalApp.service.JournalEntryService;
import com.tothenew.journalApp.service.UserService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/journal")
public class JournalEntryControllerV2 {

    @Autowired
    private JournalEntryService journalEntryService;

    @Autowired
    private UserService userService;

//    method to get all entries of a user
    @GetMapping
    public ResponseEntity<List<JournalEntry>> getAllJournalEntriesOfUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        User user = userService.findByUserName(userName);
        List<JournalEntry> allEntry =  user.getJournalEntries(); //Here getJournalEntries is the getter method of the journalEntries in the User Entity as we have used @Data Lombok Annotation
        if(allEntry != null && !allEntry.isEmpty())
        {
            return new ResponseEntity<>(allEntry, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

//    method to create a new entry
    @PostMapping
    public ResponseEntity<JournalEntry> createEntry(@RequestBody JournalEntry myEntry) {
        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userName = authentication.getName();
            journalEntryService.saveEntry(myEntry, userName);
            return new ResponseEntity<>(myEntry, HttpStatus.CREATED);
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

//    method to get an entry by Id
    @GetMapping("id/{myId}")
    /* ResponseEntity is a class that helps you customize the entire HTTP response that you send back from a controller. */
    public ResponseEntity<Object> getJournalEntryByID(@PathVariable ObjectId myId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        User user = userService.findByUserName(userName);
        Optional<JournalEntry> foundEntry = user.getJournalEntries().stream().filter(x->x.getId().equals(myId)).findFirst();
        if (foundEntry.isPresent()) {
            return new ResponseEntity<>(foundEntry.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

//    method to delete an entry by its Id
    @DeleteMapping("/id/{myId}")
    public ResponseEntity<JournalEntry> deleteJournalEntryByID(@PathVariable ObjectId myId) throws Exception {
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String userName = authentication.getName();
                boolean removed = journalEntryService.deleteByid(myId, userName);
                if(removed)
                {
                    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
                }
                else {
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }

            }
            catch (Exception e)
            {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

    }

//    method to update an existing entry by its Id
    @PutMapping("/id/{id}")
    public ResponseEntity<?> updateJournalById(@PathVariable ObjectId id,@RequestBody JournalEntry updatedEntry) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        User user = userService.findByUserName(userName);
        List<JournalEntry> collect = user.getJournalEntries().stream()
                .filter(x -> x.getId().equals(id))
                .collect(Collectors.toList());

        if(collect.isEmpty())
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Optional<JournalEntry> journalEntry = journalEntryService.findById(id);
        /* here we are calling findById(id) to search for JournalEntry by its ID, There exists two possibilities 1. The Entry is Found and we get JournalEntry Object and 2. the entry is not found we get a null
        * so in case of null if we use Optional it will avoid nullPointerException */
            if(journalEntry.isPresent())
            {
                JournalEntry old = journalEntry.get();
                old.setTitle(updatedEntry.getTitle() != null && !updatedEntry.getTitle().isEmpty() ? updatedEntry.getTitle() : old.getTitle());
                old.setContent(updatedEntry.getContent() != null && !updatedEntry.getContent().isEmpty() ? updatedEntry.getContent() : old.getContent());

                journalEntryService.saveEntry(old);
                return new ResponseEntity<>(old, HttpStatus.OK);
            }
        else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }
}
