package com.campuskart.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication //1. Enables Spring Boot auto-configuration
//2. Enables component scanning
//3. Marks this class as the main config class
public class CampuskartApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(CampuskartApiApplication.class, args);
	}

}
