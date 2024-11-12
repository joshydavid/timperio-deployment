package com.Timperio.service.impl;

import java.util.*;
import com.Timperio.models.User;
import com.Timperio.enums.*;
import com.Timperio.dto.*;

public interface UserService {

    public User createUser(CreateUpdateUserAdminDto input);

    public void deleteUserById(Integer userId);

    public void deleteUserByEmail(String userEmail);

    public User updateUser(Integer userId, UpdateUserDto input);

    public User updateUserAdmin(Integer userId, CreateUpdateUserAdminDto input);

    public List<User> findAll();

    public User findByUserId(Integer userId);

    public Optional<User> findByUserEmail(String userEmail);

    public Optional<User> findByName(String userName);

    public List<User> findByRole(Role role);
}