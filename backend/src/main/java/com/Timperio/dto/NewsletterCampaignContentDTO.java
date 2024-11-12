package com.Timperio.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewsletterCampaignContentDTO {
    private String campaignID;
    private String htmlContent;
}
