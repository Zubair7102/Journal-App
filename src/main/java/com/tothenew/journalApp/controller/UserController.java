package com.tothenew.journalApp.controller;
import com.tothenew.journalApp.api.response.WeatherResponse;
import com.tothenew.journalApp.entity.User;
import com.tothenew.journalApp.repository.UserRepository;
import com.tothenew.journalApp.service.UserService;
import com.tothenew.journalApp.service.WeatherService;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

//Controller --> Service --> Controller
/* Controllers are special type of classes or components that handle http requests */
@RestController /* @RestController: This tells Spring Boot that this class will handle HTTP requests and return data in JSON format. */
@RequestMapping("/user")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WeatherService weatherService;


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
    public ResponseEntity<User> updateUser(@RequestBody User user) throws Exception
    {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userName = authentication.getName();
            User userInDb = userService.findByUserName(userName);
            userInDb.setUserName(user.getUserName());
            userInDb.setPassword(user.getPassword());
            userService.saveUser(userInDb);
            return new ResponseEntity<>(userInDb, HttpStatus.OK);
        } catch (Exception e) {
//            throw new Exception("Phatt gaya bhaiya");
            log.error("Failed to Update the User");
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
//
        }
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

    @GetMapping("/greet")
    public ResponseEntity<?> greeting(@RequestParam String cityName)
    {
        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            WeatherResponse weatherResponse = weatherService.getWeather(cityName);
            String greeting = "";
            if(weatherResponse != null)
            {
                greeting = "Weather feels like "+ weatherResponse.getCurrent().getFeelslike();
            }
            return new ResponseEntity<>("Hi " + authentication.getName() + " " + greeting, HttpStatus.OK);
        }
        catch (Exception e)
        {
            log.error("Sorry! the provided credentials are wrong", e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }







}
