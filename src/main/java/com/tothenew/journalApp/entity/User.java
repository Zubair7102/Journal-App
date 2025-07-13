package com.tothenew.journalApp.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
@Data
//@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User entity for authentication and profile management")
public class User {

    @Id 
    @Schema(description = "Unique identifier for the user", example = "507f1f77bcf86cd799439011")
    private ObjectId id;

    @Indexed(unique = true) //this will ensure to keep unique username
    @NonNull
    @Schema(description = "Unique username for the user", example = "john_doe")
    private String userName;
    
    @NonNull
    @Schema(description = "User password", example = "password123")
    private String password;

    @Schema(description = "User email address", example = "john.doe@example.com")
    private String email;
    
    @Schema(description = "Enable sentiment analysis for journal entries", example = "true")
    private Boolean sentimentAnalysis;

    @DBRef /* The @DBRef annotation is used to create a reference (relationship) between two MongoDB documents @DBRef tells MongoDB:
    "This field links to another collection && this creates a one-to-many relationship: One User → Many Journal Entries*/
    private List<JournalEntry> journalEntries = new ArrayList<>();
    /* journalEntries will keep the reference of the entries created inside the journal_entries collection of the Journal DB   */

    private List<String> roles;
}
