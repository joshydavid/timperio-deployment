package com.Timperio.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.Timperio.enums.CustomerSegment;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewsletterCampaignContentDTO {

    private CustomerSegment customerSegment;
    private String htmlContent;

}
