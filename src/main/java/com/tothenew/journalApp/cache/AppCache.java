package com.tothenew.journalApp.cache;

import jakarta.annotation.PostConstruct;

import java.util.Map;

public class AppCache {
    private Map<String, String> appCache;

    @PostConstruct
    public void init(){
        appCache = null;
    }
}
