package com.tothenew.journalApp.entity;

public class JournalEntry {
    private long id;

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
    public long getId() {
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
    public void setId(long id)
    {
        this.id = id;
    }
}
