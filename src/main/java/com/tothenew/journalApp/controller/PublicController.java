package com.tothenew.journalApp.controller;

import com.tothenew.journalApp.entity.User;
import com.tothenew.journalApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public")
public class PublicController {

    @Autowired
    private UserService userService;

    @GetMapping("/health-check")
    /* @GetMapping: This annotation is used to map HTTP GET requests to a specific method in the controller. */
    public String healthCheck() 
    {
        return "OK"; 
    }

    @PostMapping("/create-user")
    public void createUser(@RequestBody User user)
    {
        userService.saveNewUser(user);
    }

}
