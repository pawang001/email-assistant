package com.email_assistant.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Refill;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class RateLimitConfig {

    @Bean
    public Bandwidth emailBandwidth() {
        return Bandwidth.classic(
                3,
                Refill.greedy(3, Duration.ofMinutes(1))
        );
    }

}
