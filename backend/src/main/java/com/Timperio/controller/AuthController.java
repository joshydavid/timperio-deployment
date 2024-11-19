package com.Timperio.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.userdetails.UserDetails;

import com.Timperio.constant.UrlConstant;
import com.Timperio.dto.LoginUserDto;
import com.Timperio.enums.Role;
import com.Timperio.models.User;

import com.Timperio.responses.LoginResponse;
import com.Timperio.service.impl.AuthService;
import com.Timperio.service.impl.JwtService;
import com.Timperio.service.CustomUserDetailsService;

@RequestMapping(UrlConstant.API_VERSION + "/auth")
@RestController
public class AuthController {
    private final JwtService jwtService;
    private final AuthService authenticationService;
    private final CustomUserDetailsService customUserDetailsService;

    public AuthController(JwtService jwtService, AuthService authenticationService, CustomUserDetailsService customUserDetailsService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.customUserDetailsService = customUserDetailsService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
        User authenticatedUser = authenticationService.authenticate(loginUserDto);
        Role userRole = authenticatedUser.getRole();
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(loginUserDto.getUserEmail());

        String jwtToken = jwtService.generateToken(userDetails);

        LoginResponse response = new LoginResponse();
        response.setToken(jwtToken);
        response.setExpiresIn(3600);
        response.setRole(userRole);

        return ResponseEntity.ok(response);
    }
}
