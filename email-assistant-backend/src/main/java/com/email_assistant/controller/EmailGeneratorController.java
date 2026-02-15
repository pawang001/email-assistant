package com.email_assistant.controller;

import com.email_assistant.dto.EmailRequest;
import com.email_assistant.exception.RateLimitExceededException;
import com.email_assistant.service.EmailGeneratorService;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("api/email")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class EmailGeneratorController {

    private final EmailGeneratorService emailGeneratorService;
    private final Bandwidth emailBandwidth;
    private final Map<String, Bucket> bucketCache = new ConcurrentHashMap<>();

    private Bucket resolveBucket(String ip) {
        return bucketCache.computeIfAbsent(ip,
                k -> Bucket.builder().addLimit(emailBandwidth).build());
    }

    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@Valid @RequestBody EmailRequest emailRequest,
                                                HttpServletRequest request) {

        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null) {
            ip = request.getRemoteAddr();
        }

        Bucket bucket = resolveBucket(ip);

        if (!bucket.tryConsume(1)) {
            throw new RateLimitExceededException("Rate limit exceeded. Try again later.");
        }
        String response = emailGeneratorService.generateEmailReply(emailRequest);
        return ResponseEntity.ok(response);
    }
}
