package com.Timperio.dto;

import java.util.List;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.Timperio.enums.CustomerSegment;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewsletterRequestDTO {

    private CustomerSegment customerSegment;

    @Email(message = "Invalid email address")
    private List<String> emails;

    private String htmlContent;
}
