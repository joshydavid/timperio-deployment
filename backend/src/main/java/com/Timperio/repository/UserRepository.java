package com.Timperio.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.Timperio.models.User;

import java.util.*;
import com.Timperio.enums.*;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {
    List<User> findAll();

    User findByUserId(Integer userId);

    Optional<User> findByUserEmail(String userEmail);

    Optional<User> findByName(String userName);

    List<User> findByRole(Role role);
}

