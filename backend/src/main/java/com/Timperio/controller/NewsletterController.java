package com.Timperio.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Timperio.constant.UrlConstant;
import com.Timperio.dto.NewsletterCampaignContentDTO;
import com.Timperio.dto.NewsletterRequestDTO;
import com.Timperio.service.impl.NewsletterService;

@RequestMapping(UrlConstant.API_VERSION + "/newsletter")
@RestController

public class NewsletterController {

    @Autowired
    private NewsletterService newsletterService;

    @GetMapping("/healthCheck")
    public ResponseEntity<String> healthCheck() {
        return this.newsletterService.healthCheck();
    }

    @GetMapping("/getCampaigns")
    public ResponseEntity<String> getCampaigns() {
        return this.newsletterService.getCampaigns();
    }

    @PutMapping("/setCampaignContent")
    public ResponseEntity<String> setCampaignContent(
            @RequestBody NewsletterCampaignContentDTO newsletterCampaignContentDTO) {
        return this.newsletterService.setCampaignContent(newsletterCampaignContentDTO);
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendNewsletter(@RequestBody NewsletterRequestDTO newsletterRequestDTO) {
        return this.newsletterService.sendNewsletter(newsletterRequestDTO);
    }

}
