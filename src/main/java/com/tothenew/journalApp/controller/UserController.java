package com.tothenew.journalApp.controller;
import com.tothenew.journalApp.entity.JournalEntry;
import com.tothenew.journalApp.entity.User;
import com.tothenew.journalApp.service.UserService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
        userService.saveUser(user);
    }

//    method to update an existing user
    @PutMapping("/{userName}")
    public ResponseEntity<User> updateUser(@RequestBody User user, @PathVariable String userName)
    {
        User userInDb = userService.findByUserName(userName);
        if(userInDb != null)
        {
            userInDb.setUserName(user.getUserName());
            userInDb.setPassword(user.getPassword());
            userService.saveUser(userInDb);
            return new ResponseEntity<>(userInDb, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

//    Method to delete a user
    @DeleteMapping("/id/{userId}")
    public ResponseEntity<User> deleteUserById(@PathVariable("userId") ObjectId userId)
    {
        userService.deleteById(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//        return true;
    }







}
