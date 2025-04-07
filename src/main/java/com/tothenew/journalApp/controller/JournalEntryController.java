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

    @GetMapping //@GetMapping is an annotation used in Spring MVC to handle HTTP GET requests.     Get localhost:8080\journal
    public List<JournalEntry> getAll(){
        return new ArrayList<>(journalEntries.values()); /* this Converts the values from the HashMap into a list and returns them.*/ 
    }

    @PostMapping /* POST localhost:8080\journal */
    public boolean createEntry(@RequestBody JournalEntry myEntry) /* This is the method that will run when the request comes in.
It returns a boolean (true means the entry was successfully added). */
            /* By writing @RequestBody we are saying "Hey Spring" please take the data from the request and turn it into a java object (here JournalEntry) that we can use in code
            * use Postman and sed POST request with {
    "id": 1,
    "title": "Hello Zubair",
    "content": "Hello this is the testing POST body 1"
} it will be stored as new JournalEntry(1, "Hello Zubair", "Hello this is the testing POST body 1" ,  this will be create a new Entry in the JournalEntry with variable myEntry */
    {
        journalEntries.put(myEntry.getId(), myEntry);
        return true;
    }

//    here we are creating a method to get an entry object based on the given id
    @GetMapping("id/{myId}")
    public JournalEntry getJournalEntryByID(@PathVariable Long myId )
    {
    return journalEntries.get(myId);
    }

//    this method will delete the entry object based on the given id
    @DeleteMapping("/id/{myId}")
    public JournalEntry deleteJournalEntryByID(@PathVariable Long myId)
    {
        return journalEntries.remove(myId);
    }

//    this method will update the pre existing entry based on the provided id
    @PutMapping("/id/{id}")
    public JournalEntry updateJournalById(@PathVariable Long id, @RequestBody JournalEntry myEntry){
        return journalEntries.put(id, myEntry);
    }

}
