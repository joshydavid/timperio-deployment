package com.Timperio.service.impl;

import com.Timperio.dto.LoginUserDto;
import com.Timperio.models.User;

public interface AuthService {
    User authenticate(LoginUserDto input);
}
