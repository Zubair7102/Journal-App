package com.tothenew.journalApp.cache;

import com.tothenew.journalApp.entity.ConfigJournalAppEntity;
import com.tothenew.journalApp.repository.ConfigJournalAppRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class AppCache {

    public enum keys{
        WEATHER_API;
    }

    @Autowired
    private ConfigJournalAppRepository configJournalAppRepository;
    public Map<String, String> appCache;

//    Note: You can only have one @PostConstruct method per class.
    @PostConstruct
    public void init(){
        appCache = new HashMap<>();
        List<ConfigJournalAppEntity> all = configJournalAppRepository.findAll();
        for(ConfigJournalAppEntity configJournalAppEntity : all)
        {
            appCache.put(configJournalAppEntity.getKey(), configJournalAppEntity.getValue());
        }
    }
}
