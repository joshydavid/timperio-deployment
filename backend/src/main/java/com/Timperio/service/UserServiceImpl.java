package com.Timperio.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import com.Timperio.enums.*;
import com.Timperio.models.*;
import com.Timperio.dto.*;
import com.Timperio.exceptions.*;
import com.Timperio.repository.UserRepository;
import com.Timperio.service.impl.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;


@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(CreateUpdateUserAdminDto input) {
        User user;
        
        switch (input.getRole()) {
            case ADMIN:
                user = new AdminUser(); 
                break;
            case MARKETING:
                user = new MarketingUser();
                break;
            case SALES:
                user = new SalesUser();
                break;
            default:
                throw new InvalidRoleException("Invalid role: " + input.getRole());
        }
    
        user.setName(input.getName());
        user.setUserEmail(input.getUserEmail());
        user.setPassword(passwordEncoder.encode(input.getPassword()));
    
        return userRepository.save(user);
    }

    public void deleteUserById(Integer userId){
        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
            userRepository.delete(user);
        } catch (Exception e) {
            throw new RuntimeException(ErrorMessage.DELETE_USER_ERROR.getMessage());
        }
        
    };

    public void deleteUserByEmail(String userEmail){
        try {
            User user = userRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userEmail));
            userRepository.delete(user);
        } catch (Exception e) {
            throw new RuntimeException(ErrorMessage.DELETE_USER_ERROR.getMessage());
        }
    };

    public User updateUserAdmin(Integer userId, CreateUpdateUserAdminDto input) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        
        if (user.getRole() == Role.ADMIN) {
            throw new AdminAccountUpdateException(ErrorMessage.ADMIN_ACCOUNT_UPDATE_ERROR.getMessage());
        }

        if (input.getUserEmail() != null) {
            user.setUserEmail(input.getUserEmail());
        }
        if (input.getName() != null) {
            user.setName(input.getName());
        }
        if (input.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(input.getPassword()));
        }

        if (input.getRole() != null) {
            try {
                user.setRole(input.getRole());
            } catch (IllegalArgumentException e) {
                throw new InvalidRoleException("Invalid role: " + input.getRole());
            }
        }

        return userRepository.save(user);
    }

    public User updateUser(Integer userId, UpdateUserDto input) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        if (input.getName() != null) {
            user.setName(input.getName());
        }
        if (input.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(input.getPassword()));
        }

        return userRepository.save(user);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findByUserId(Integer userId) {
        return userRepository.findByUserId(userId);
    }

    public Optional<User> findByUserEmail(String userEmail) {
        return userRepository.findByUserEmail(userEmail);
    }

    public Optional<User> findByName(String userName) {
        return userRepository.findByName(userName);
    }

    public List<User> findByRole(Role role) {
        return userRepository.findByRole(role);
    }

    public void saveUser(MarketingUser user) {
        userRepository.save(user);
    }

    public void saveUser(SalesUser user) {
        userRepository.save(user);
    }

    public void saveUser(AdminUser user) {
        userRepository.save(user);
    }

}
