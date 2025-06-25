package com.tothenew.journalApp.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class EmailServiceTests {
    @Autowired
    private EmailService emailService;

    @Test
    void testSendMail()
    {
        emailService.sendEmail("shazam6090@gmail.com", "Journal-App-Mail-Send-Test", "Hello this is the mail to check the Journal App Mail Send feature implementation");
    }


}
