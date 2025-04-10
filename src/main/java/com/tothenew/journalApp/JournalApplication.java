package com.tothenew.journalApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class JournalApplication {

	public static void main(String[] args) {
		SpringApplication.run(JournalApplication.class, args); /* This
		is a static method from the SpringApplication class.
It boots up the Spring Boot application.
It creates an ApplicationContext, which manages all the Spring Beans.
 This refers to the main class of your Spring Boot app.*/
	}

}
