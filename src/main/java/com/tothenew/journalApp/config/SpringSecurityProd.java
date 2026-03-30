package com.tothenew.journalApp.config;

import com.tothenew.journalApp.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity // Activates security features like authentication and authorization.
@Profile("prod")
public class SpringSecurityProd {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**", "/auth/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/api-docs/**", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated()
        );

        http.httpBasic(basic -> {});
        http.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.csrf(csrf -> csrf.ignoringRequestMatchers(
                new AntPathRequestMatcher("/public/**"),
                new AntPathRequestMatcher("/auth/**"),
                new AntPathRequestMatcher("/swagger-ui/**"),
                new AntPathRequestMatcher("/api-docs/**"),
                new AntPathRequestMatcher("/v3/api-docs/**")
        ));

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);
        /* Ask Spring Security: "Give me the AuthenticationManagerBuilder object", which helps build AuthenticationManager step-by-step. */
        authenticationManagerBuilder.userDetailsService(userDetailsService) /* Tell Spring: "Whenever someone logs in, use my custom UserDetailsServiceImpl class to load user info (username, password, roles) from database." */
                .passwordEncoder(passwordEncoder());
        return authenticationManagerBuilder.build(); /* Build and return the AuthenticationManager ready to use for login."
         */
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // BCrypt algorithm to encode passwords
    }
}
