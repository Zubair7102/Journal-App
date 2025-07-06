package com.tothenew.journalApp.service;

import com.tothenew.journalApp.entity.User;
import com.tothenew.journalApp.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JournalEntryService journalEntryService;

    @ParameterizedTest
    @ValueSource(strings = {
            "Ballu",
            "Zubair",
            "Kaisilious"
    })
    public void testFindByUserName(String name){
//        assertEquals(4, 3+1);
//        assertNotNull(userRepository.findByUserName("Ballu"));
//        User user = userRepository.findByUserName("Zubair");
        assertNotNull(userRepository.findByUserName(name));
    }

    @ParameterizedTest
    @CsvSource({
            "1,1,2",
            "2,10,12",
            "3,3,6"   /* Fail */
    })
    public void test(int a, int b, int expected)
    {
        assertEquals(expected,a+b);
    }
}
