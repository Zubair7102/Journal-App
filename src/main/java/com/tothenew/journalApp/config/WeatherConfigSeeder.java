package com.tothenew.journalApp.config;

import com.tothenew.journalApp.cache.AppCache;
import com.tothenew.journalApp.constants.PlaceHolders;
import com.tothenew.journalApp.entity.ConfigJournalAppEntity;
import com.tothenew.journalApp.repository.ConfigJournalAppRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class WeatherConfigSeeder implements ApplicationRunner {

    private static final String WEATHER_API_KEY = AppCache.keys.WEATHER_API.name();
    private static final String WEATHERSTACK_URL_TEMPLATE =
            "https://api.weatherstack.com/current?access_key=" + PlaceHolders.API_KEY + "&query=" + PlaceHolders.CITY;

    private final ConfigJournalAppRepository configJournalAppRepository;
    private final AppCache appCache;

    public WeatherConfigSeeder(ConfigJournalAppRepository configJournalAppRepository, AppCache appCache) {
        this.configJournalAppRepository = configJournalAppRepository;
        this.appCache = appCache;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!configJournalAppRepository.existsByKey(WEATHER_API_KEY)) {
            ConfigJournalAppEntity config = new ConfigJournalAppEntity();
            config.setKey(WEATHER_API_KEY);
            config.setValue(WEATHERSTACK_URL_TEMPLATE);
            configJournalAppRepository.save(config);
            appCache.init();
            log.info("Seeded default WEATHER_API config for WeatherStack");
        }
    }
}
