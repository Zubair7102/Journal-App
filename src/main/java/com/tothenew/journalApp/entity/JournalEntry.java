package com.tothenew.journalApp.entity;

import com.tothenew.journalApp.enums.Sentiment;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Date;
//Entity is just like model in nodeJs in express backend
/* @Document annotation is used in Spring Data MongoDB to tell Spring that a class should be stored as a MongoDB document */
@Document(collection = "journal_entries")

//Below annotations are Lombok annotations that are used to reduce the boilerplate code, like Getters, Setters, Constructdors, toString() etc, using this you won't have to create seperate getters and setters, just write the annotations and it will do the rest on its own
@Data //@Data annotation is a shortcut that combines several commonly used Lombok annotations into one, eg. @Getters, @Setters
@NoArgsConstructor
public class JournalEntry {
    @Id
    private ObjectId id;


    private String title;

    private String content;

    private LocalDateTime date;
    private Sentiment sentiment;

}

