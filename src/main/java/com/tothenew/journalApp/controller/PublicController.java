package com.tothenew.journalApp.controller;

import com.tothenew.journalApp.entity.User;
import com.tothenew.journalApp.service.UserDetailsServiceImpl;
import com.tothenew.journalApp.service.UserService;
import com.tothenew.journalApp.utils.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/public")
@Tag(name = "Public API", description = "Public endpoints for authentication and health check")
public class PublicController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/health-check")
    @Operation(summary = "Health Check", description = "Check if the API is running")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "API is healthy")
    })
    public String healthCheck() 
    {
        return "OK"; 
    }

    @PostMapping("/signup")
    @Operation(summary = "User Signup", description = "Register a new user account")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "User registered successfully"),
        @ApiResponse(responseCode = "409", description = "User already exists")
    })
    public ResponseEntity<String> signup(@RequestBody User user) {
        log.info("Signup endpoint called for user: {}", user.getUserName());
        // Check if user already exists
        if (userService.findByUserName(user.getUserName()) != null) {
            log.info("User already exists: {}", user.getUserName());
            return new ResponseEntity<>("User already exists", HttpStatus.CONFLICT);
        }
        userService.saveNewUser(user);
        log.info("Signup successful for user: {}", user.getUserName());
        return new ResponseEntity<>("Signup successful", HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "User Login", description = "Authenticate user and return JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login successful", 
                    content = @Content(schema = @Schema(example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."))),
        @ApiResponse(responseCode = "400", description = "Incorrect username or password")
    })
    public ResponseEntity<String> login(@RequestBody User user) throws Exception
    {
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUserName(), user.getPassword()));
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUserName());
            String jwt = jwtUtil.generateToken(userDetails.getUsername());
            return new ResponseEntity<>(jwt, HttpStatus.OK);
        }
        catch (Exception e)
        {
            log.error("Exception occurred while createAuthenticationToken", e);
            return new ResponseEntity<>("Incorrect username or password", HttpStatus.BAD_REQUEST);
        }

    }
}
