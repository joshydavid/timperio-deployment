package com.Timperio.models;

import lombok.Data;
import jakarta.persistence.*;
import com.Timperio.enums.*;

@Entity
@DiscriminatorValue("ADMIN")
@Data
public class AdminUser extends User {
    public AdminUser() {
        super(); 
        this.setRole(Role.ADMIN); 
    }

    public AdminUser(String userEmail, String password, String userName) {
        super(userEmail, password, userName);
        this.setRole(Role.ADMIN); 
    }

    @Override
    public void setRole(Role role) {
        if (role != Role.ADMIN) {
            throw new IllegalArgumentException("Role for AdminUser must be ADMIN.");
        }
        super.setRole(role);
    }
}
