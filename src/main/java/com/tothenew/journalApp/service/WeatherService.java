package com.tothenew.journalApp.service;

import com.tothenew.journalApp.api.response.WeatherResponse;
import com.tothenew.journalApp.cache.AppCache;
import com.tothenew.journalApp.constants.PlaceHolders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {
    
    @Value("${weather.api.key}")
    private String apiKey;

    @Autowired
    private AppCache appCache;

    @Autowired
    private RedisService redisService;

    @Autowired
    private RestTemplate restTemplate;

    public WeatherResponse getWeather(String city)
    {
        WeatherResponse weatherResponse = redisService.get("weather_of_" + city, WeatherResponse.class);
        if (weatherResponse != null) {
            return weatherResponse;
        }

        String apiTemplate = appCache.appCache.get(AppCache.keys.WEATHER_API.toString());
        if (apiTemplate == null || apiTemplate.isBlank()) {
            throw new IllegalStateException("WEATHER_API config is missing. Seed config_journal_app in MongoDB.");
        }
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("weather.api.key is not configured");
        }

        String finalAPI = apiTemplate
                .replace(PlaceHolders.CITY, city)
                .replace(PlaceHolders.API_KEY, apiKey);
        ResponseEntity<WeatherResponse> response = restTemplate.exchange(
                finalAPI, HttpMethod.GET, null, WeatherResponse.class);
        WeatherResponse body = response.getBody();
        if (body != null) {
            redisService.set("weather_of_" + city, body, 300L);
        }
        return body;
    }

}
