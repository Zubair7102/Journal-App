package com.tothenew.journalApp.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/* @Document annotation is used in Spring Data MongoDB to tell Spring that a class should be stored as a MongoDB document */
@Document
public class JournalEntry {
    @Id
    private String id;

    private String title;

    private String content;

//    content getters
    public String getContent() {
        return content;
    }

//    Title getter
    public String getTitle() {
        return title;
    }

//    Id getter
    public String getId() {
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
    public void setId(String id)
    {
        this.id = id;
    }
}

