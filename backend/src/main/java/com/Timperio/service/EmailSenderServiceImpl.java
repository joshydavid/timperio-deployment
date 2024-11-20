package com.Timperio.service;

import java.util.Arrays;
import java.util.List;
import java.util.Properties;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import com.Timperio.dto.NewsletterRequestDTO;
import com.Timperio.enums.CustomerSegment;
import com.Timperio.models.Customer;
import com.Timperio.service.impl.EmailSenderService;

@Service
public class EmailSenderServiceImpl implements EmailSenderService {

    private String LOGIN_EMAIL;
    private String LOGIN_PASSWORD;

    @Autowired
    private CustomerServiceImpl customerService;

    @Autowired
    public EmailSenderServiceImpl(@Value("${newsletter.email.login}") String emailLogin,
            @Value("${newsletter.email.password}") String emailPassword) {
        this.LOGIN_EMAIL = emailLogin;
        this.LOGIN_PASSWORD = emailPassword;
    }

    public ResponseEntity<String> sendNewsletter(NewsletterRequestDTO newsletterRequestDTO) {
        CustomerSegment customerSegment = newsletterRequestDTO.getCustomerSegment();
        String[] emails = new String[0];
        if (customerSegment != null) {
            List<Customer> customers = this.customerService.getCustomerBySegment(customerSegment);
            emails = customers.stream().map(Customer::getCustomerEmail).toArray(String[]::new);
        }

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
                return new PasswordAuthentication(LOGIN_EMAIL, LOGIN_PASSWORD);
            }
        });

        try {

            for (int i = 0; i < allEmails.length; i += 100) {
                MimeMessage message = new MimeMessage(session);
                message.setFrom(new InternetAddress(LOGIN_EMAIL));
                message.setSubject("Timperio Marketing");
                String htmlContent = newsletterRequestDTO.getHtmlContent();

                message.setContent(htmlContent, "text/html; charset=UTF-8");

                for (int j = i; j < i + 100 && j < allEmails.length; j++) {
                    message.addRecipient(Message.RecipientType.BCC, new InternetAddress(allEmails[j]));
                }

                Transport.send(message);
                Thread.sleep(1000);
            }
        } catch (MessagingException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to send emails: " + e.getMessage());
        }

        return ResponseEntity.ok("Newsletter sent successfully.");
    }
}
