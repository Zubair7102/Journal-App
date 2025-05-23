package com.tothenew.journalApp.repository;

import com.tothenew.journalApp.entity.JournalEntry;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

// <JournalEntry, String> means: store JournalEntry objects, and use String as the ID type, *****MongoRepository<WhatObjectYouStore, WhatTypeIsItsID>*****
public interface JournalEntryRepository extends MongoRepository<JournalEntry, ObjectId>{

}

// Controller --> Service --> Repository