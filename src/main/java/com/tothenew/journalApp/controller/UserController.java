package com.tothenew.journalApp.controller;
import com.tothenew.journalApp.entity.JournalEntry;
import com.tothenew.journalApp.entity.User;
import com.tothenew.journalApp.repository.UserRepository;
import com.tothenew.journalApp.service.UserService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @Autowired
    private UserRepository userRepository;

//    method to get all the Users
//    @GetMapping
//    public List<User> getAllUser(){
//        return userService.getAll();
//    }

//    Method to add new User
//    @PostMapping
//    public void createUser(@RequestBody User user)
//    {
//        userService.saveUser(user);
//    }

//    method to update an existing user
    @PutMapping
    public ResponseEntity<User> updateUser(@RequestBody User user)
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        User userInDb = userService.findByUserName(userName);
            userInDb.setUserName(user.getUserName());
            userInDb.setPassword(user.getPassword());
            userService.saveUser(userInDb);
            return new ResponseEntity<>(userInDb, HttpStatus.OK);
    }

//    Method to delete a user
    @DeleteMapping
    public ResponseEntity<User> deleteUserById(@PathVariable ObjectId userId)
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userRepository.deleteByUserName(authentication.getName());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//        return true;
    }







}
