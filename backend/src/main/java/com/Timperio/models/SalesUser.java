package com.Timperio.models;

import lombok.Data;
import jakarta.persistence.*;
import com.Timperio.enums.*;

@Entity
@DiscriminatorValue("SALES")
@Data
public class SalesUser extends User {
    public SalesUser() {
        super(); 
        this.setRole(Role.SALES); 
    }

    public SalesUser(String userEmail, String password, String userName) {
        super(userEmail, password, userName);
        this.setRole(Role.SALES); 
    }

    @Override
    public void setRole(Role role) {
        if (role != Role.SALES) {
            throw new IllegalArgumentException("Role for SalesUser must be SALES.");
        }
        super.setRole(role);
    }
}
