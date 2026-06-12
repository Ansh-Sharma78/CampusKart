package com.campuskart.api.health;

import com.campuskart.api.common.ApiResponse;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController //This tells Spring that this class exposes REST APIs.
@RequestMapping("/api/v1/health")  //This sets the base URL for the controller
public class HealthController {

    @GetMapping
    public ApiResponse<Map<String, String>> health() {
        return ApiResponse.success("CampusKart API is healthy", Map.of("status", "UP"));
    }
}
//Why This File Exists
//This file gives us a simple way to test if the backend is alive.