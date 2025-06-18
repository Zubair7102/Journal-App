package com.tothenew.journalApp.service;

import com.tothenew.journalApp.entity.User;
import com.tothenew.journalApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

/*This code helps Spring Security to fetch user details (like username, password, roles) from your own database (not from in-memory, but from your UserRepository).
It is a custom implementation of UserDetailsService to connect Spring Security and your User table.
Whenever someone tries to login, Spring Security calls this loadUserByUsername method to check if the username and password are correct. */

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUserName(username);
        if(user != null)
        {
            return org.springframework.security.core.userdetails.User.builder()
                    /* This line creates a new User object from Spring Security using its builder pattern.
It’s creating a UserDetails object, which contains the username, password, and roles of the user. */
                    .username(user.getUserName()) //This sets the username in the UserDetails object to the username retrieved from the user object (fetched from the database).
                    .password(user.getPassword()) //here we are setting the password
                    .roles(user.getRoles().toArray(new String[0]))
                    /* This sets the roles in the UserDetails object.
user.getRoles() returns the roles as a list (like ADMIN, USER, etc.).
.toArray(new String[0]) converts that list into an array of strings, */
                    .build(); //This builds the UserDetails object and returns it, completing the creation of the UserDetails with username, password, and roles.
//                    return userDetails;


        }
        else{
            throw new UsernameNotFoundException("User not found with the username: " + username);
        }
    }
}
