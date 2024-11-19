package com.Timperio.service;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.Timperio.enums.ErrorMessage;
import com.Timperio.exceptions.UserNotFoundException;
import com.Timperio.models.User;
import com.Timperio.repository.RolePermissionRepository;
import com.Timperio.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RolePermissionRepository rolePermissionRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUserEmail(username)
                .orElseThrow(() -> new UserNotFoundException(ErrorMessage.INVALID_USER_ID.getMessage() + username));

        Set<GrantedAuthority> authorities = rolePermissionRepository.findByRole(user.getRole())
                .stream()
                .map(rolePermission -> new SimpleGrantedAuthority(rolePermission.getPermission().getName()))
                .collect(Collectors.toSet());

        return new org.springframework.security.core.userdetails.User(
                user.getUserEmail(), user.getPassword(), authorities);
    }
}
