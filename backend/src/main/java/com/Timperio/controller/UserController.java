package com.Timperio.controller;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.Timperio.enums.*;
import com.Timperio.models.User;
import com.Timperio.service.impl.UserService;
import com.Timperio.dto.*;
import com.Timperio.exceptions.*;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping()
    public ResponseEntity<User> createUser(@RequestBody CreateUpdateUserAdminDto createUserDto) {
        User newUser = this.userService.createUser(createUserDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/id/{userId}")
    public ResponseEntity<String> deleteUserById(@PathVariable Integer userId) {
        this.userService.deleteUserById(userId);
        return ResponseEntity.ok(SuccessMessage.USER_DELETED_SUCCESS.toString());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/email/{userEmail}")
    public ResponseEntity<String> deleteUserByEmail(@PathVariable String userEmail) {
        this.userService.deleteUserByEmail(userEmail);
        return ResponseEntity.ok(SuccessMessage.USER_DELETED_SUCCESS.toString());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<Object> updateUser(@PathVariable Integer userId, @RequestBody UpdateUserDto updateUserDto, @AuthenticationPrincipal(expression = "userId") Integer authenticatedUserId) {
        if (!userId.equals(authenticatedUserId)) {
            throw new AccessDeniedException(ErrorMessage.UPDATE_USER_ACCESS_DENIED.getMessage());
        }

        try {
            User updatedUser = this.userService.updateUser(userId, updateUserDto);
            return ResponseEntity.ok(updatedUser);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/admin/{userId}")
    public ResponseEntity<Object> updateUserAdmin(@PathVariable Integer userId, @RequestBody CreateUpdateUserAdminDto updateUserDto) {
        try {
            User updatedUser = this.userService.updateUserAdmin(userId, updateUserDto);
            return ResponseEntity.ok(updatedUser);

        } catch (AdminAccountUpdateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());  
        } catch (InvalidRoleException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping()
    public List<UserDto> getUsers() {
        return this.userService.findAll();
    }

    @GetMapping("/{userId}")
    public UserDto getUser(@PathVariable Integer userId) {
        return this.userService.findByUserId(userId);
    }

    @GetMapping("/email/{userEmail}")
    public ResponseEntity<UserDto> getUserByEmail(@PathVariable String userEmail) {
        Optional<UserDto> optionalUserDto = userService.findByUserEmail(userEmail);
        return optionalUserDto.map(ResponseEntity::ok)
                        .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/name/{userName}")
    public ResponseEntity<UserDto> getUserByName(@PathVariable String name) {
        Optional<UserDto> optionalUserDto = userService.findByName(name);
        return optionalUserDto.map(ResponseEntity::ok)
                          .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/role/{role}")
    public List<UserDto> getUsersByRole(@PathVariable Role role) {
        return this.userService.findByRole(role);
    }

}