package com.Timperio.service;

import com.Timperio.dto.*;
import com.Timperio.models.*;
import com.Timperio.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.Timperio.service.impl.AuthService;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;

    public AuthServiceImpl(UserRepository userRepository, AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
    }

    public User authenticate(LoginUserDto input) {
        authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(input.getUserEmail(), input.getPassword()));

        return userRepository.findByUserEmail(input.getUserEmail()).orElseThrow();
    }
}
