package com.tothenew.journalApp.service;

import com.tothenew.journalApp.entity.JournalEntry;
import com.tothenew.journalApp.repository.JournalEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class JournalEntryService {

    /* @Autowired is an annotation used in Spring to automatically inject (or connect) one class into another */
    @Autowired
    private JournalEntryRepository journalEntryRepository;
    /* the above 2 lines are basically mneans that
    * It tells Spring:
“Hey, I need an object of JournalEntryRepository here. Please create it and give it to me automatically. This is Known as Dependency injection ”
* without @Autowired we have to write  JournalEntryRepository journalEntryRepository = new JournalEntryRepository(); // Manual way (not preferred in Spring) */

    public void saveEntry(JournalEntry journalEntry)
    {
        journalEntryRepository.save(journalEntry);
    }

}
