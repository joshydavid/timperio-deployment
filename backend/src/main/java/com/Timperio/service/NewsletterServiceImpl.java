package com.Timperio.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.Timperio.config.MailChimpConstant;
import com.Timperio.dto.NewsletterCampaignContentDTO;
import com.Timperio.dto.NewsletterRequestDTO;
import com.Timperio.service.impl.NewsletterService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class NewsletterServiceImpl implements NewsletterService {

    @Autowired
    private MailChimpConstant mailChimpConstant;

    @Autowired
    private RestTemplate restTemplate;

    public ResponseEntity<String> healthCheck() {
        String datacenter = this.mailChimpConstant.getDatacenter();
        String url = String.format("https://%s.api.mailchimp.com/3.0/ping", datacenter);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBasicAuth("anystring", this.mailChimpConstant.getAPI_KEY());

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> exchange = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        return exchange;
    }

    public ResponseEntity<String> getCampaigns() {
        String datacenter = this.mailChimpConstant.getDatacenter();
        String url = String.format("https://%s.api.mailchimp.com/3.0/campaigns", datacenter);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBasicAuth("anystring", this.mailChimpConstant.getAPI_KEY());

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> exchange = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        return exchange;
    }

    public ResponseEntity<String> setCampaignContent(NewsletterCampaignContentDTO newsletterCampaignContentDTO) {
        String campaignId = newsletterCampaignContentDTO.getCampaignID();
        String htmlContent = newsletterCampaignContentDTO.getHtmlContent();

        String datacenter = this.mailChimpConstant.getDatacenter();
        String url = String.format("https://%s.api.mailchimp.com/3.0/campaigns/%s/content", datacenter,
                campaignId);

        String requestBody = String.format("{\"html\":\"%s\"}", htmlContent.replace("\"", "\\\""));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBasicAuth("anystring", this.mailChimpConstant.getAPI_KEY());
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> exchange = restTemplate.exchange(url, HttpMethod.PUT, entity, String.class);

        if (exchange.getStatusCode().is2xxSuccessful()) {
            return exchange;
        } else {
            return ResponseEntity.status(exchange.getStatusCode()).body(null);
        }
    }

    public ResponseEntity<String> sendNewsletter(NewsletterRequestDTO newsletterRequestDTO) {
        // NewsletterResponseDTO responseDTO = new
        // NewsletterResponseDTO(newsletterRequestDTO.getEmail(), "success");
        // String hashedEmail = this.md5Encode(newsletterRequestDTO.getEmail());

        String datacenter = this.mailChimpConstant.getDatacenter();
        String campaignId = "a8be941ee5";
        String url = String.format("https://%s.api.mailchimp.com/3.0/campaigns/%s/actions/test", datacenter,
                campaignId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBasicAuth("anystring", this.mailChimpConstant.getAPI_KEY());

        HttpEntity<NewsletterRequestDTO> requestEntity = new HttpEntity<>(newsletterRequestDTO, headers);
        String requestBody = "{\"test_emails\":[],\"send_type\":\"html\"}";

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> exchange = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        System.out.println(exchange.getBody());
        // ResponseEntity<NewsletterResponseDTO> response = new
        // ResponseEntity<>(exchange.getBody(), exchange.getStatusCode());

        if (exchange.getStatusCode().is2xxSuccessful()) {
            return exchange;
        } else {
            return ResponseEntity.status(exchange.getStatusCode()).body(null);
        }
    }
}
