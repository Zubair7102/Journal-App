package com.tothenew.journalApp.controller;
import com.tothenew.journalApp.entity.JournalEntry;
import com.tothenew.journalApp.entity.User;
import com.tothenew.journalApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
//Controller --> Service --> Controller
/* Controllers are special type of classes or components that handle http requests */
@RestController /* @RestController: This tells Spring Boot that this class will handle HTTP requests and return data in JSON format. */
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

//    method to get all the Users
    @GetMapping
    public List<User> getAllUser(){
        return userService.getAll();
    }

//    Method to add new User
    @PostMapping
    public void createUser(@RequestBody User user)
    {
        userService.saveEntry(user);
    }

//    method to update an existing user
    @PutMapping
    public ResponseEntity<User> updateUser(@RequestBody User user)
    {

    }






}
