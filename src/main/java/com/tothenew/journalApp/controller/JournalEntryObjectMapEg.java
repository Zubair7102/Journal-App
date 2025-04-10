package com.tothenew.journalApp.controller;

import java.util.HashMap;
import java.util.Map;

//this code file is just an understanding demo, it dpes not have any part in the code
class EntryC{
    private String title;
    private String content;

    //    Constructor
    public EntryC(String title, String content)
    {
        this.title = title;
        this.content = content;
    }
}
public class JournalEntryObjectMapEg {
    public static void main(String[] args) {
        HashMap<Long, EntryC> journalE = new HashMap<>();

//        these are the objects of the class Entry having title and content fields, this will be stored in the HashMap's Entry part
        EntryC e1 = new EntryC("Day1", "Content1");
        EntryC e2 = new EntryC("Day2", "Content2");

        journalE.put(1l, e1);
        journalE.put(2l, e2);

        System.out.println(journalE);

        for (Map.Entry<Long, EntryC> entry : journalE.entrySet()) {
            System.out.println("ID: " + entry.getKey() + " -> " + entry.getValue());
        }


    }
}
