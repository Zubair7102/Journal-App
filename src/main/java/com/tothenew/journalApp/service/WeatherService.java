package com.tothenew.journalApp.service;

import com.tothenew.journalApp.api.response.WeatherResponse;
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

    public static final String api = "http://api.weatherstack.com/current?access_key=API_KEY&query=CITY";

    @Autowired
    private RestTemplate restTemplate;

    public WeatherResponse getWeather(String city)
    {
        String finalAPI = api.replace("CITY", city).replace("API_KEY", apiKey);
         ResponseEntity<WeatherResponse> response =  restTemplate.exchange(finalAPI, HttpMethod.GET, null, WeatherResponse.class);
         return response.getBody();
    }

}
