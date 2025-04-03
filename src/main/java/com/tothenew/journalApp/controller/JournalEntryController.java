package com.tothenew.journalApp.controller;
import com.tothenew.journalApp.entity.JournalEntry;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/* Controllers are special type of classes or components that handle http requests */
@RestController /* @RestController: This tells Spring Boot that this class will handle HTTP requests and return data in JSON format. */
@RequestMapping("/journal")
public class JournalEntryController {

    private Map<Long, JournalEntry> journalEntries = new HashMap<>(); 
    /* The key is Long (entry ID), and the value is a JournalEntry object. */

    /* Methods inside a controller class should be public so that they can be accessed and invoked by the Spring FrameWork or External HTTP requests */

    @GetMapping
    public List<JournalEntry> getAll(){
        return new ArrayList<>(journalEntries.values()); 
        /* This method returns a list of all journal entries. */
        /* The values() method returns a collection of all the values (JournalEntry objects) in the HashMap. */
        /* The ArrayList constructor takes a collection as an argument and creates a new ArrayList containing the elements of that collection. */
        /* this Converts the values from the HashMap into a list and returns them.*/   
    }

    @PostMapping
    public boolean createEntry(@RequestBody JournalEntry myEntry)
            /* By writing @RequestBody we are saying "Hey Spring" please take the data from the request and turn it into a java object (here JournalEntry) that we can use in code  */
    {
        journalEntries.put(myEntry.getId(), myEntry); /* This line adds the new entry to the journalEntries map using the entry ID as the key. */
        /* The put method is used to add a new entry to the HashMap. It takes two arguments: the key (entry ID) and the value (JournalEntry object). */ 
        return true; /* This method returns true if the entry is created successfully. */
    }
}
