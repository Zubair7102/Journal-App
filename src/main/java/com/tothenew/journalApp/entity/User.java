package com.tothenew.journalApp.entity;

import lombok.Data;
import lombok.NonNull;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
@Data
public class User {

    @Id private ObjectId id;

    @Indexed(unique = true) //this will ensure to keep unique username
    @NonNull
    private String userName;
    @NonNull
    private String password;

    @DBRef /* The @DBRef annotation is used to create a reference (relationship) between two MongoDB documents @DBRef tells MongoDB:
    "This field links to another collection && this creates a one-to-many relationship: One User → Many Journal Entries*/
    private List<JournalEntry> journalEntries = new ArrayList<>();
    /* journalEntries will keep the reference of the entries created inside the journal_entries collection of the Journal DB   */
}
