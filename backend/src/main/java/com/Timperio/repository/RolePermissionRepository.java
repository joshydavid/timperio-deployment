package com.Timperio.repository;

import org.springframework.data.repository.CrudRepository;

import com.Timperio.models.Permission;
import com.Timperio.models.RolePermission;
import com.Timperio.enums.Role;

import java.util.List;

public interface RolePermissionRepository extends CrudRepository<RolePermission, Integer> {
    List<RolePermission> findByRole(Role role);
    List<RolePermission> findAll();
    void deleteByPermission(Permission permission);
}