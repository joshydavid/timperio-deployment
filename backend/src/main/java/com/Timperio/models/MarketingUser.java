package com.Timperio.models;

import lombok.Data;
import jakarta.persistence.*;
import com.Timperio.enums.*;

@Entity
@DiscriminatorValue("MARKETING")
@Data
public class MarketingUser extends User {
    
    public MarketingUser() {
        super(); 
        this.setRole(Role.MARKETING); 
    }

    public MarketingUser(String userEmail, String password, String userName) {
        super(userEmail, password, userName);
        this.setRole(Role.MARKETING); 
    }

    @Override
    public void setRole(Role role) {
        if (role != Role.MARKETING) {
            throw new IllegalArgumentException("Role for MarketingUser must be MARKETING.");
        }
        super.setRole(role);
    }
}