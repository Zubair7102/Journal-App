package com.tothenew.journalApp.entity;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Date;
//Entity is just like model in nodeJs in express backend
/* @Document annotation is used in Spring Data MongoDB to tell Spring that a class should be stored as a MongoDB document */
@Document(collection = "journal_entries")
public class JournalEntry {
    @Id
    private ObjectId id;

    private String title;

    private String content;

    private LocalDateTime date;

//    getter Date
    public LocalDateTime getDate() {
        return date;
    }

//    Setter
    public void setDate(LocalDateTime date)
    {
        this.date = date;
    }
//    content getters
    public String getContent() {
        return content;
    }

//    Title getter
    public String getTitle() {
        return title;
    }

//    Id getter
    public ObjectId getId() {
        return id;
    }

//    content Setters
    public void setContent(String content)
    {
        this.content = content;
    }

//    Title setter
    public void setTitle(String title)
    {
        this.title = title;
    }

//    Id setter
    public void setId(ObjectId id)
    {
        this.id = id;
    }
}

