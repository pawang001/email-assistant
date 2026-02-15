package com.email_assistant.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmailRequest {

    @NotBlank
    private String emailContent;
    private String tone;
}
