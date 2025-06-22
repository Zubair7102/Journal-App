package com.tothenew.journalApp.controller;

import com.tothenew.journalApp.cache.AppCache;
import com.tothenew.journalApp.entity.JournalEntry;
import com.tothenew.journalApp.entity.User;
import com.tothenew.journalApp.service.JournalEntryService;
import com.tothenew.journalApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private AppCache appCache;
    @Autowired
    private UserService userService;

    @Autowired
    private JournalEntryService journalEntryService;

    @GetMapping("/all-users")
    public ResponseEntity<?> getAllUsers(){
        List<User> all = userService.getAll();
        if(all != null && !all.isEmpty())
        {
            return new ResponseEntity<>(all, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    @GetMapping("/all-journals")
    public ResponseEntity<?> getAllJournal()
    {
        List<JournalEntry> journalEntry = journalEntryService.getAll();
        if(journalEntry != null && !journalEntry.isEmpty())
        {
            return new ResponseEntity<>(journalEntry, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/create-admin-user")
    public void createUser(@RequestBody User user)
    {
        userService.saveAdmin(user);
    }

    @GetMapping("clear-app-cache")
    public void clearAppCache()
    {
        appCache.init();
    }

}
