package com.Timperio.service;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;
import java.util.stream.Stream;

import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.InternetHeaders;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

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

import java.io.File;
import java.nio.file.Files;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Service
@AllArgsConstructor
public class NewsletterServiceImpl implements NewsletterService {

    @Autowired
    private CustomerServiceImpl customerService;

    @Autowired
    private MailChimpConstant mailChimpConstant;

    @Autowired
    private RestTemplate restTemplate;

    private String TEMPLATE_DIR;
    private String TEMPLATE_FILE_NAME;
    private String LOGIN_EMAIL;
    private String LOGIN_PASSWORD;

    @Autowired
    public NewsletterServiceImpl(
        @Value("${newsletter.template.dir}") String templateDir,
        @Value("${newsletter.template.name}") String templateFileName,
        @Value("${newsletter.email.login}") String emailLogin,
        @Value("${newsletter.email.password}") String emailPassword) {
        this.TEMPLATE_DIR = templateDir;
        this.TEMPLATE_FILE_NAME = templateFileName;
        this.LOGIN_EMAIL = emailLogin;
        this.LOGIN_PASSWORD = emailPassword;
    }


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
        return ResponseEntity.status(404).body("Template not found");
        // String datacenter = this.mailChimpConstant.getDatacenter();
        // String url = String.format(UrlConstant.MAILCHIMP_CAMPAIGNS, datacenter);

        // HttpHeaders headers = new HttpHeaders();
        // headers.setContentType(MediaType.APPLICATION_JSON);
        // headers.setBasicAuth("anystring", this.mailChimpConstant.getAPI_KEY());

        // HttpEntity<String> entity = new HttpEntity<>(headers);
        // ResponseEntity<String> exchange = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        // return exchange;
    }

    public ResponseEntity<String> setCampaignContent(NewsletterCampaignContentDTO newsletterCampaignContentDTO) {
        String htmlContent = newsletterCampaignContentDTO.getHtmlContent();
        
        try {
            // Create a new file or overwrite the existing file with the new content
            File templateDir = new File(TEMPLATE_DIR);
            if (!templateDir.exists()) {
                templateDir.mkdirs(); // Create the directory if it doesn't exist
            }
            File file = new File(TEMPLATE_DIR + File.separator + TEMPLATE_FILE_NAME);
            // Write the content to the file
            Files.write(file.toPath(), htmlContent.getBytes(StandardCharsets.UTF_8));
            return ResponseEntity.ok("Template content updated successfully");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to update campaign content");
        }
    }

    public ResponseEntity<String> getCampaignContent() {
        try {
            File file = new File(TEMPLATE_DIR + File.separator + TEMPLATE_FILE_NAME);
            if (!file.exists()) {
                return ResponseEntity.status(404).body("Template not found");
            }

            // Read the content of the file
            String content = new String(java.nio.file.Files.readAllBytes(file.toPath()));            
            return ResponseEntity.ok(content);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to read campaign content");
        }
    }

    public ResponseEntity<String> sendNewsletter(NewsletterRequestDTO newsletterRequestDTO) {
        // Extract customer segment and fetch customers from the service
        CustomerSegment customerSegment = newsletterRequestDTO.getCustomerSegment();
        String[] emails = new String[0];
        if(customerSegment != null){
            List<Customer> customers = this.customerService.getCustomerBySegment(customerSegment);
            emails = customers.stream().map(Customer::getCustomerEmail).toArray(String[]::new);
        }

        // Additional emails provided in the request
        String[] additionalEmails = newsletterRequestDTO.getEmails().toArray(String[]::new);

        // Combine customer emails and additional emails
        String[] allEmails = Stream.concat(Arrays.stream(emails), Arrays.stream(additionalEmails))
                                .toArray(String[]::new);

        // Gmail SMTP server properties
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        // Create mail session
        Session session = Session.getInstance(props, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(LOGIN_EMAIL, LOGIN_PASSWORD);
            }
        });

        try {
            // Send emails in batches of 100
            for (int i = 0; i < allEmails.length; i += 100) {
                MimeMessage message = new MimeMessage(session);
                message.setFrom(new InternetAddress(LOGIN_EMAIL));
                message.setSubject("Timperio Marketing"); // Set email subject
                String htmlContent = newsletterRequestDTO.getHtmlContent(); // Assuming plain text content is available
                // Set the content as plain text
                message.setContent(htmlContent, "text/html; charset=UTF-8");
                
                // Add recipients in batches of 100
                for (int j = i; j < i + 100 && j < allEmails.length; j++) {
                    message.addRecipient(Message.RecipientType.BCC, new InternetAddress(allEmails[j]));
                }

                // Send email
                Transport.send(message);

                // Pause between batches to avoid throttling
                Thread.sleep(1000);
            }
        } catch (MessagingException | InterruptedException e) {
            // Log error and respond with failure
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to send emails: " + e.getMessage());
        }

        // Successful response
        return ResponseEntity.ok("Newsletter sent successfully.");
    }

}
