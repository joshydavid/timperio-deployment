package com.Timperio.service;

import java.util.Arrays;
import java.util.List;
import java.util.Properties;
import java.util.stream.Stream;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.Timperio.config.MailChimpConstant;
import com.Timperio.constant.UrlConstant;
import com.Timperio.dto.NewsletterCampaignContentDTO;
import com.Timperio.dto.NewsletterRequestDTO;
import com.Timperio.enums.CustomerSegment;
import com.Timperio.models.Customer;
import com.Timperio.service.impl.NewsletterService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class NewsletterServiceImpl implements NewsletterService {

    @Autowired
    private CustomerServiceImpl customerService;

    @Autowired
    private MailChimpConstant mailChimpConstant;

    @Autowired
    private RestTemplate restTemplate;

    public ResponseEntity<String> healthCheck() {
        String datacenter = this.mailChimpConstant.getDatacenter();
        String url = String.format(UrlConstant.MAILCHIMP_PING, datacenter);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBasicAuth("anystring", this.mailChimpConstant.getAPI_KEY());

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> exchange = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        return exchange;
    }

    public ResponseEntity<String> getCampaigns() {
        String datacenter = this.mailChimpConstant.getDatacenter();
        String url = String.format(UrlConstant.MAILCHIMP_CAMPAIGNS, datacenter);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBasicAuth("anystring", this.mailChimpConstant.getAPI_KEY());

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> exchange = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        return exchange;
    }

    public ResponseEntity<String> getCampaignContent() {
        String campaignId = "7aa95eea65";

        String datacenter = this.mailChimpConstant.getDatacenter();
        String url = String.format("https://%s.api.mailchimp.com/3.0/campaigns/%s/content", datacenter, campaignId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBasicAuth("anystring", this.mailChimpConstant.getAPI_KEY());
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> exchange = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        if (exchange.getStatusCode().is2xxSuccessful()) {
            return exchange;
        } else {
            return ResponseEntity.status(exchange.getStatusCode()).body(null);
        }
    }

    public ResponseEntity<String> setCampaignContent(NewsletterCampaignContentDTO newsletterCampaignContentDTO) {
        String campaignId = "7aa95eea65";
        String htmlContent = newsletterCampaignContentDTO.getHtmlContent();

        String datacenter = this.mailChimpConstant.getDatacenter();
        String url = String.format("https://%s.api.mailchimp.com/3.0/campaigns/%s/content", datacenter, campaignId);

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

    private static final String FROM_EMAIL = "timperio@liawjunyi.site"; // Your email address
    private static final String PASSWORD = "hwfbxwvjbsiqlmpx";

    public ResponseEntity<String> sendNewsletter(NewsletterRequestDTO newsletterRequestDTO) {
        CustomerSegment customerSegment = newsletterRequestDTO.getCustomerSegment();
        List<Customer> customers = this.customerService.getCustomerBySegment(customerSegment);
        String[] emails = customers.stream().map(Customer::getCustomerEmail).toArray(String[]::new);

        String[] additionalEmails = newsletterRequestDTO.getEmails().toArray(String[]::new);

        String[] allEmails = Stream.concat(Arrays.stream(emails), Arrays.stream(additionalEmails))
                .toArray(String[]::new);

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(FROM_EMAIL, PASSWORD);
            }
        });

        try {
            for (int i = 0; i < allEmails.length; i += 100) {
                MimeMessage message = new MimeMessage(session);
                message.setFrom(new InternetAddress(FROM_EMAIL));
                message.setSubject("test");
                message.setContent(newsletterRequestDTO.getHtmlContent(), "text/html");

                for (int j = i; j < i + 100 && j < allEmails.length; j++) {
                    message.addRecipient(Message.RecipientType.BCC, new InternetAddress(allEmails[j]));
                }

                Transport.send(message);

                Thread.sleep(1000);
            }
        } catch (MessagingException | InterruptedException e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok("Sent message successfully....");

    }

}
