package com.Timperio.service;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import org.springframework.http.ResponseEntity;

import com.Timperio.dto.NewsletterCampaignContentDTO;
import com.Timperio.service.impl.TemplateService;

@Service
public class TemplateServiceImpl implements TemplateService {

    private String TEMPLATE_DIR;
    private String TEMPLATE_FILE_NAME;

    @Autowired
    public TemplateServiceImpl(@Value("${newsletter.template.dir}") String templateDir,
            @Value("${newsletter.template.name}") String templateFileName) {

        this.TEMPLATE_DIR = templateDir;
        this.TEMPLATE_FILE_NAME = templateFileName;

    }

    public ResponseEntity<String> setTemplate(NewsletterCampaignContentDTO newsletterCampaignContentDTO) {
        String htmlContent = newsletterCampaignContentDTO.getHtmlContent();

        try {
            File templateDir = new File(TEMPLATE_DIR);
            if (!templateDir.exists()) {
                templateDir.mkdirs();
            }
            File file = new File(TEMPLATE_DIR + File.separator + TEMPLATE_FILE_NAME);
            Files.write(file.toPath(), htmlContent.getBytes(StandardCharsets.UTF_8));
            return ResponseEntity.ok("Template content updated successfully");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to update campaign content");
        }
    }

    public ResponseEntity<String> getTemplate() {
        try {
            File file = new File(TEMPLATE_DIR + File.separator + TEMPLATE_FILE_NAME);
            if (!file.exists()) {
                return ResponseEntity.status(404).body("Template not found");
            }

            String content = new String(java.nio.file.Files.readAllBytes(file.toPath()));
            return ResponseEntity.ok(content);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to read campaign content");
        }
    }
}
