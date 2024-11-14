package com.Timperio.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
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

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(CreateUpdateUserAdminDto input) {
        User user = null;
        Role role = input.getRole();

        switch (role) {
            case ADMIN :
                user = new User();
                user.setRole(Role.ADMIN);
                break;
            case MARKETING :
                user = new User();
                user.setRole(Role.MARKETING);
                break;
            case SALES :
                user = new User();
                user.setRole(Role.SALES);
                break;
            default :
                throw new InvalidRoleException(ErrorMessage.INVALID_ROLE.getMessage() + role);
        }

        user.setName(input.getName());
        user.setUserEmail(input.getUserEmail());
        user.setPassword(passwordEncoder.encode(input.getPassword()));

        return userRepository.save(user);
    }

    public void deleteUserById(Integer userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new UserNotFoundException(ErrorMessage.INVALID_USER_ID.getMessage() + userId));
            userRepository.delete(user);
        } catch (Exception e) {
            throw new RuntimeException(ErrorMessage.DELETE_USER_ERROR.getMessage());
        }

    };

    public void deleteUserByEmail(String userEmail) {
        try {
            User user = userRepository.findByUserEmail(userEmail).orElseThrow(
                    () -> new UserNotFoundException(ErrorMessage.INVALID_USER_EMAIL.getMessage() + userEmail));
            userRepository.delete(user);
        } catch (Exception e) {
            throw new RuntimeException(ErrorMessage.DELETE_USER_ERROR.getMessage());
        }
    };

    public User updateUserAdmin(Integer userId, CreateUpdateUserAdminDto input) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(ErrorMessage.INVALID_USER_ID.getMessage() + userId));

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
                .orElseThrow(() -> new UserNotFoundException(ErrorMessage.INVALID_USER_ID.getMessage() + userId));

        if (input.getName() != null) {
            user.setName(input.getName());
        }
        if (input.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(input.getPassword()));
        }

        return userRepository.save(user);
    }

    public List<UserDto> findAll() {
        List<User> users = userRepository.findAll();
        return users.stream().map(this::convertToUserDto).collect(Collectors.toList());
    }

    public UserDto findByUserId(Integer userId) {
        User user = userRepository.findByUserId(userId);
        return convertToUserDto(user);
    }

    public Optional<UserDto> findByUserEmail(String userEmail) {
        return userRepository.findByUserEmail(userEmail).map(this::convertToUserDto);
    }

    public Optional<UserDto> findByName(String userName) {
        return userRepository.findByName(userName).map(this::convertToUserDto);
    }

    public List<UserDto> findByRole(Role role) {
        List<User> users = userRepository.findByRole(role);
        return users.stream().map(this::convertToUserDto).collect(Collectors.toList());
    }

    private UserDto convertToUserDto(User user) {
        UserDto userDTO = new UserDto();
        userDTO.setUserId(user.getUserId());
        userDTO.setUserEmail(user.getUserEmail());
        userDTO.setName(user.getName());
        userDTO.setRole(user.getRole());
        return userDTO;
    }

}
