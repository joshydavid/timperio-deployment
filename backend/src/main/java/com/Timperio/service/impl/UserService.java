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

    public List<UserDto> findAll();

    public UserDto findByUserId(Integer userId);

    public Optional<UserDto> findByUserEmail(String userEmail);

    public Optional<UserDto> findByName(String userName);

    public List<UserDto> findByRole(Role role);
}