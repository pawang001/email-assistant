package com.email_assistant.service;

import com.email_assistant.dto.EmailRequest;
import com.email_assistant.dto.GeminiRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@Service
public class EmailGeneratorService {

    private final ObjectMapper objectMapper;
    private final WebClient webClient;
    private final String apiKey;

    // Initializing WebClient and Gemini Api Key.
    public EmailGeneratorService(WebClient.Builder webClientBuilder,
                                 ObjectMapper objectMapper,
                                 @Value("${gemini.api.url}") String baseUrl,
                                 @Value("${gemini.api.key}") String geminiApiKey) {
        this.webClient = webClientBuilder.baseUrl(baseUrl).build();
        this.apiKey = geminiApiKey;
        this.objectMapper = objectMapper;
    }

    public String generateEmailReply(EmailRequest emailRequest) {
        // Build Prompt
        String prompt = buildPrompt(emailRequest);

        // Prepare raw JSON Body
        GeminiRequest request = new GeminiRequest(
                List.of(
                        new GeminiRequest.Content(
                                List.of(new GeminiRequest.Part(prompt))
                        )
                )
        );

        // Send Request
        String response = webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1beta/models/gemini-3-flash-preview:generateContent")
                        .build())
                .header("x-goog-api-key", apiKey)
                .bodyValue(request)
                .retrieve()
                .onStatus(status -> status.isError(), clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .map(errorBody ->
                                        new RuntimeException("Gemini API error: " + errorBody)))
                .bodyToMono(String.class)
                .block();

        // Extract response
        return extractResponseContent(response);
    }

    // Extract useful content from response
    private String extractResponseContent(String response) {
        try {
            JsonNode root = objectMapper.readTree(response);

            JsonNode textNode = root.path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text");

            if (textNode.isMissingNode()) {
                throw new RuntimeException("Invalid Gemini response");
            }

            return textNode.asText();

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini response", e);
        }
    }


    // Building a prompt for generating email based on email content and tone.
    private String buildPrompt(EmailRequest emailRequest) {

        String tone = emailRequest.getTone() != null && !emailRequest.getTone().isBlank()
                ? emailRequest.getTone()
                : "professional";

        return """
                You are an AI Email Assistant.

                TASK:
                Generate a reply email.

                REQUIREMENTS:
                - Tone: %s
                - Do not repeat the original email
                - Return only the email body

                ORIGINAL EMAIL:
                %s
                """.formatted(tone, emailRequest.getEmailContent());
    }

}
