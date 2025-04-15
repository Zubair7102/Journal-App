package com.tothenew.journalApp.repository;

import com.tothenew.journalApp.entity.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, ObjectId> {
    User findByUserName(String username);
    //here User is the return type of the Method which name is findByUserName and inside this method we are passing parameter "String username " as it will be used to search the database for the given username, if it finds the user it will return the User Object and if not it will return with null
}
