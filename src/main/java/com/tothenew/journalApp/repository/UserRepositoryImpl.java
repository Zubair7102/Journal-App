package com.tothenew.journalApp.repository;

import com.tothenew.journalApp.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.List;

public class UserRepositoryImpl {

    @Autowired
    private MongoTemplate mongoTemplate;
    /* MongoTemplate is a class provided by Spring Data MongoDB that offers a lower-level, more flexible way to interact with a MongoDB database compared to using the Spring Data repository abstraction (MongoRepository). */

    public List<User> getUserForSA()
    {
        Query query = new Query();
//        query.addCriteria(Criteria.where("userName").is("Zubair"));
//        query.addCriteria(Criteria.where("field").ne("value"));
//        query.addCriteria(Criteria.where("email").exists(true));
//        query.addCriteria(Criteria.where("email").ne(null).ne(""));
        query.addCriteria(Criteria.where("email").regex("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$"));
        query.addCriteria(Criteria.where("sentimentAnalysis").is(true));
        List<User> users =  mongoTemplate.find(query, User.class);
        return users;
    }
}
