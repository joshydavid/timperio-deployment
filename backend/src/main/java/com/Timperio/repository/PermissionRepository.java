package com.Timperio.repository;

import org.springframework.data.repository.CrudRepository;

import com.Timperio.models.Permission;
import java.util.Optional;

public interface PermissionRepository extends CrudRepository<Permission, Integer> {
    Optional<Permission> findByName(String name);
}