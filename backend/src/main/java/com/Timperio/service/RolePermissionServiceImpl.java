package com.Timperio.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import com.Timperio.service.impl.RolePermissionService;
import com.Timperio.repository.RolePermissionRepository;
import com.Timperio.repository.PermissionRepository;

import java.util.*;
import java.time.LocalDateTime;
import com.Timperio.enums.Role;
import com.Timperio.dto.GetUpdateRolePermission;
import com.Timperio.enums.ErrorMessage;
import com.Timperio.models.RolePermission;
import com.Timperio.models.Permission;
import com.Timperio.exceptions.PermissionNotFoundException;

@Service
public class RolePermissionServiceImpl implements RolePermissionService {

    @Autowired
    private RolePermissionRepository rolePermissionRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    public List<RolePermission> findAll() {
        return rolePermissionRepository.findAll();
    };

    public List<GetUpdateRolePermission> getRolePermissions() {

        List<GetUpdateRolePermission> permissionList = new ArrayList<>();
        Map<String, Set<Role>> roleMap = new HashMap<>();

        List<RolePermission> rpList = this.findAll();
        for (RolePermission rp: rpList) {
            Set<Role> roleSet;
            Role role = rp.getRole();
            Permission perm = rp.getPermission();
            String permName = perm.getName();
            
            if (roleMap.containsKey(permName)) {
                roleSet = roleMap.get(permName);                
            } else {
                roleSet = new HashSet<>(); 
            }

            roleSet.add(role);
            roleMap.put(permName, roleSet);
        }

        roleMap.forEach((key, value) -> {
            GetUpdateRolePermission row = new GetUpdateRolePermission();
            row.setAction(key);
            row.setRole(new ArrayList<>(value));
            permissionList.add(row);
        });

        return permissionList;
    }

    @Transactional
    public void updateRolePermissions(List<GetUpdateRolePermission> updates) {
        for (GetUpdateRolePermission update : updates) {
            String action = update.getAction();
            List<Role> roles = update.getRole();

            Permission permission = permissionRepository.findByName(action)
                .orElseThrow(() -> new PermissionNotFoundException(ErrorMessage.PERMISSION_NOT_FOUND.getMessage()));

            rolePermissionRepository.deleteByPermission(permission);

            for (Role role : roles) {
                RolePermission rolePermission = new RolePermission();
                rolePermission.setPermission(permission);
                rolePermission.setRole(role);
                rolePermission.setCreatedAt(LocalDateTime.now());
                rolePermission.setUpdatedAt(LocalDateTime.now());
                
                rolePermissionRepository.save(rolePermission);
            }
        }
    }


}
