package com.Timperio.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import com.Timperio.config.MailChimpConstant;
import com.Timperio.constant.UrlConstant;
import com.Timperio.dto.NewsletterCampaignContentDTO;
import com.Timperio.dto.NewsletterRequestDTO;
import com.Timperio.service.impl.NewsletterService;
import com.Timperio.enums.CustomerSegment;
import com.Timperio.models.Customer;
import lombok.AllArgsConstructor;

import java.net.Authenticator;
import java.util.Arrays;
import java.util.stream.Stream;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;

import okhttp3.*;

import org.json.JSONArray;
import org.json.JSONObject;

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
        String url = String.format("https://%s.api.mailchimp.com/3.0/campaigns/%s/content",
                datacenter,
                campaignId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBasicAuth("anystring", this.mailChimpConstant.getAPI_KEY());
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> exchange = restTemplate.exchange(url, HttpMethod.GET,
                entity, String.class);

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

        System.out.println(requestBody);
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
        System.out.println("emails: " + Arrays.toString(emails));
        System.out.println(Arrays.toString(additionalEmails));

        String[] allEmails = Stream.concat(Arrays.stream(emails),
                Arrays.stream(additionalEmails))
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

                // Add up to 100 recipients to BCC
                for (int j = i; j < i + 100 && j < allEmails.length; j++) {
                    message.addRecipient(Message.RecipientType.BCC, new InternetAddress(allEmails[j]));
                }

                Transport.send(message);
                System.out.println("Batch sent successfully.");

                // Optional: Introduce a delay between batches
                Thread.sleep(1000); // 1 second delay
            }
        } catch (MessagingException | InterruptedException e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok("Sent message successfully....");

    }

    // public ResponseEntity<String> sendNewsletter(NewsletterRequestDTO
    // newsletterRequestDTO) {
    // NewsletterResponseDTO responseDTO = new
    // NewsletterResponseDTO(newsletterRequestDTO.getEmail(), "success");
    // String hashedEmail = this.md5Encode(newsletterRequestDTO.getEmail());
    // CustomerSegment customerSegment = newsletterRequestDTO.getCustomerSegment();
    // List<Customer> customers =
    // this.customerService.getCustomerBySegment(customerSegment);
    // String[] emails =
    // customers.stream().map(Customer::getCustomerEmail).toArray(String[]::new);

    // String[] additionalEmails =
    // newsletterRequestDTO.getEmails().toArray(String[]::new);
    // System.out.println("emails: " + Arrays.toString(emails));
    // System.out.println(Arrays.toString(additionalEmails));

    // String[] allEmails = Stream.concat(Arrays.stream(emails),
    // Arrays.stream(additionalEmails))
    // .toArray(String[]::new);
    // String htmlContent = newsletterRequestDTO.getHtmlContent();

    // // ============ Create Campaign ============
    // System.out.println("=========== Create Campaign ===========");

    // String datacenter = this.mailChimpConstant.getDatacenter();
    // String campaignId = "a8be941ee5";
    // String url = String.format("https://%s.api.mailchimp.com/3.0/campaigns",
    // datacenter);

    // HttpHeaders headers = new HttpHeaders();
    // headers.setContentType(MediaType.APPLICATION_JSON);
    // headers.setBasicAuth("anystring", this.mailChimpConstant.getAPI_KEY());

    // String requestBody = "{\"type\":\"regular\"}";

    // HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
    // ResponseEntity<String> exchange = restTemplate.exchange(url, HttpMethod.POST,
    // entity, String.class);
    // System.out.println(exchange.getBody());
    // System.out.println("=========== End of Create Campaign ===========");

    // // ============ Create Audience List ============
    // System.out.println("=========== Create Audience List ===========");
    // url = String.format("https://%s.api.mailchimp.com/3.0/lists", datacenter);
    // requestBody = "{\"name\":\"Timperio Newsletter\",
    // \"contact\":{\"company\":\"Timperio\",\"address1\":\"SMU\",\"city\":\"Singapore\",\"zip\":\"469060\",\"state\":\"Singapore\",\"country\":\"Singapore\"},
    // \"permission_reminder\":\"You signed up for Timperio's newsletter\",
    // \"campaign_defaults\":{\"from_name\":\"Timperio\",\"from_email\":\"hello@timperio.com\",\"subject\":\"Timperio
    // Newsletter\",\"language\":\"en\"}, \"email_type_option\":false}";

    // entity = new HttpEntity<>(requestBody, headers);
    // exchange = restTemplate.exchange(url, HttpMethod.POST,
    // entity, String.class);
    // System.out.println(exchange.getBody());
    // String audienceListId = new JSONObject(exchange.getBody()).getString("id");
    // System.out.println("=========== End of Create Audience List ===========");

    // // ============ Add Members to Audience List ============
    // System.out.println("=========== Add Members to Audience List ===========");
    // JSONArray members = new JSONArray();

    // for (String email : allEmails) {
    // if (email != null && !email.trim().isEmpty()) { // Check for non-null and
    // non-empty emails
    // JSONObject memberData = new JSONObject();
    // memberData.put("email_address", email.trim());
    // memberData.put("status", "subscribed");

    // // Log the JSON request body for each member
    // System.out.println("Request JSON for email: " + email + " - " +
    // memberData.toString());

    // url = String.format("https://%s.api.mailchimp.com/3.0/lists/%s/members",
    // datacenter, audienceListId);
    // entity = new HttpEntity<>(memberData.toString(), headers);

    // try {
    // exchange = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
    // System.out.println("Response for email: " + email + " - " +
    // exchange.getBody());
    // } catch (HttpClientErrorException e) {
    // System.out.println("Error adding email: " + email + " - " +
    // e.getResponseBodyAsString());
    // }
    // } else {
    // System.out.println("Skipping invalid email: " + email);
    // }
    // }
    // System.out.println("=========== End of Add Members to Audience List
    // ===========");
    // // if (exchange.getStatusCode().is2xxSuccessful()) {
    // // return exchange;
    // // } else {
    // // return ResponseEntity.status(exchange.getStatusCode()).body(null);
    // // }
    // return exchange;

    // }

}
