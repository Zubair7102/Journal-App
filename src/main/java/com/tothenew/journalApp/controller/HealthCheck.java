package com.tothenew.journalApp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheck {

    @GetMapping("/health-check") // This method will be called when a GET request is made to the "/health-check" endpoint.
    /* @GetMapping: This annotation is used to map HTTP GET requests to a specific method in the controller. */
    public String healthCheck() 
    {
        return "OK"; 
    }

}
