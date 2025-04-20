package com.tothenew.journalApp.controller;

import com.tothenew.journalApp.entity.JournalEntry;
import com.tothenew.journalApp.entity.User;
import com.tothenew.journalApp.service.JournalEntryService;
import com.tothenew.journalApp.service.UserService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/journal")
public class JournalEntryControllerV2 {

    @Autowired
    private JournalEntryService journalEntryService;

    @Autowired
    private UserService userService;

//    method to get all entries
    @GetMapping("{userName}")
    public ResponseEntity<List<JournalEntry>> getAllJournalEntriesOfUser(@PathVariable String userName) {
        User user = userService.findByUserName(userName);
        List<JournalEntry> allEntry =  user.getJournalEntries();
        if(allEntry != null && !allEntry.isEmpty())
        {
            return new ResponseEntity<>(allEntry, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

//    method to create a new entry
    @PostMapping("{userName}")
    public ResponseEntity<JournalEntry> createEntry(@RequestBody JournalEntry myEntry, @PathVariable String userName) {
        try{

            myEntry.setDate(LocalDateTime.now());
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
        Optional<JournalEntry> journalEntry = journalEntryService.findById(myId);
        if(journalEntry.isPresent())
        {
            return new ResponseEntity<>(journalEntry.get(), HttpStatus.OK); //here using ResponseEntity we are sending Http codes
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

//    method to delete an entry by its Id
    @DeleteMapping("/id/{myId}")
    public ResponseEntity<JournalEntry> deleteJournalEntryByID(@PathVariable ObjectId myId) {

        journalEntryService.deleteByid(myId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//        return true;
    }

//    method to update an existing entry by its Id
//    @PutMapping("/id/{id}")
//    public ResponseEntity<JournalEntry> updateJournalById(@PathVariable ObjectId id, @RequestBody JournalEntry updatedEntry) {
//        JournalEntry oldEntry = journalEntryService.findById(id).orElse(null);
//        if(oldEntry != null) {
//            oldEntry.setTitle(updatedEntry.getTitle() != null && !updatedEntry.getTitle().equals("") ? updatedEntry.getTitle() : oldEntry.getTitle());
//            oldEntry.setContent(updatedEntry.getContent() != null && !updatedEntry.equals("") ? updatedEntry.getContent() : oldEntry.getContent());
//
//            journalEntryService.saveEntry(oldEntry, user);
//            return new ResponseEntity<>(oldEntry, HttpStatus.OK);
//        }
//        else{
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//
//    }
}
