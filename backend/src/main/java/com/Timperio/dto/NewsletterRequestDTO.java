package com.Timperio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewsletterRequestDTO {
    @Email(message = "Invalid email address")
    @NotEmpty
    private String email;
}
