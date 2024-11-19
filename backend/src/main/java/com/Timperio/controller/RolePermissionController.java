package com.Timperio.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Timperio.constant.UrlConstant;
import com.Timperio.dto.GetUpdateRolePermission;
import com.Timperio.enums.SuccessMessage;
import com.Timperio.service.impl.RolePermissionService;

@RequestMapping(UrlConstant.API_VERSION + "/permission")
@RestController

public class RolePermissionController {

    @Autowired
    private RolePermissionService rolePermissionService;

    @PreAuthorize("hasAuthority(T(com.Timperio.enums.Permission).MANAGE_USER_ACCOUNTS.getValue())")
    @GetMapping()
    public ResponseEntity<List<GetUpdateRolePermission>> getRolePermissions() {
        List<GetUpdateRolePermission> permissionList = rolePermissionService.getRolePermissions();
        return ResponseEntity.status(HttpStatus.OK).body(permissionList);
    }

    @PreAuthorize("hasAuthority(T(com.Timperio.enums.Permission).MANAGE_USER_ACCOUNTS.getValue())")
    @PutMapping()
    public ResponseEntity<String> updateRolePermissions(@RequestBody List<GetUpdateRolePermission> updates) {
        rolePermissionService.updateRolePermissions(updates);
        return ResponseEntity.ok(SuccessMessage.PERMISSION_UPDATED_SUCCESS.toString());
    }

}
