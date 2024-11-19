package com.Timperio.dto;

import com.Timperio.enums.Role;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class GetUpdateRolePermission {
    private String action;
    private List<Role> role;
}
