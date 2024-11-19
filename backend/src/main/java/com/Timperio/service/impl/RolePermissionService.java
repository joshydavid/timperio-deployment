package com.Timperio.service.impl;

import java.util.*;

import com.Timperio.dto.GetUpdateRolePermission;
import com.Timperio.models.RolePermission;
import org.springframework.stereotype.Service;

@Service
public interface RolePermissionService {
    public List<RolePermission> findAll();
    public List<GetUpdateRolePermission> getRolePermissions();
    public void updateRolePermissions(List<GetUpdateRolePermission> updates);
}
