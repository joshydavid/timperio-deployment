package com.Timperio.service.impl;

import org.springframework.http.ResponseEntity;

import com.Timperio.dto.NewsletterRequestDTO;

public interface EmailSenderService {
    ResponseEntity<String> sendNewsletter(NewsletterRequestDTO newsletterRequestDTO);
}
