package com.Timperio.service.impl;

import org.springframework.http.ResponseEntity;

import com.Timperio.dto.NewsletterCampaignContentDTO;
import com.Timperio.dto.NewsletterRequestDTO;

public interface NewsletterService {
    ResponseEntity<String> healthCheck();

    ResponseEntity<String> getCampaigns();

    ResponseEntity<String> getCampaignContent();

    ResponseEntity<String> setCampaignContent(NewsletterCampaignContentDTO newsletterCampaignContentDTO);

    ResponseEntity<String> sendNewsletter(NewsletterRequestDTO newsletterRequestDTO);

}
