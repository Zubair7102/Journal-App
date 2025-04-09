package com.tothenew.journalApp.controller;

import com.tothenew.journalApp.entity.JournalEntry;
import com.tothenew.journalApp.service.JournalEntryService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/journal")
public class JournalEntryControllerV2 {

    @Autowired
    private JournalEntryService journalEntryService;

//    method to get all entries
    @GetMapping
    public List<JournalEntry> getAll() {
        return journalEntryService.getAll();
    }

//    method to create a new entry
    @PostMapping
    public JournalEntry createEntry(@RequestBody JournalEntry myEntry) {
        myEntry.setDate(LocalDateTime.now());
        journalEntryService.saveEntry(myEntry);
        return myEntry;
    }

//    method to get an entry by Id
    @GetMapping("id/{myId}")
    public JournalEntry getJournalEntryByID(@PathVariable ObjectId myId) {
        return journalEntryService.findById(myId).orElse(null);
    }

//    method to delete an entry by its Id
    @DeleteMapping("/id/{myId}")
    public boolean deleteJournalEntryByID(@PathVariable ObjectId myId) {

        journalEntryService.deleteByid(myId);
        return true;
    }

//    method to update an existing entry by its Id
    @PutMapping("/id/{id}")
    public JournalEntry updateJournalById(@PathVariable ObjectId id, @RequestBody JournalEntry updatedEntry) {
        JournalEntry oldEntry = journalEntryService.findById(id).orElse(null);
        if(oldEntry != null)
        {
            oldEntry.setTitle(updatedEntry.getTitle() != null && !updatedEntry.getTitle().equals("") ? updatedEntry.getTitle() : oldEntry.getTitle());
            oldEntry.setContent(updatedEntry.getContent() != null && !updatedEntry.equals("") ? updatedEntry.getContent(): oldEntry.getContent());

            journalEntryService.saveEntry(oldEntry);
           return oldEntry;
        }
        return updatedEntry;
    }
}
