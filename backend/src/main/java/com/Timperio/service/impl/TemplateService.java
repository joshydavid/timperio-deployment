package com.Timperio.service.impl;

import org.springframework.http.ResponseEntity;

import com.Timperio.dto.NewsletterCampaignContentDTO;

public interface TemplateService {

    ResponseEntity<String> getTemplate();

    ResponseEntity<String> setTemplate(NewsletterCampaignContentDTO newsletterCampaignContentDTO);

}
