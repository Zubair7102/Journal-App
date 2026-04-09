package com.tothenew.journalApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.MongoTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@EnableTransactionManagement
public class JournalApplication {

	public static void main(String[] args) {
		applySanitizedEnvOverrides();
		ConfigurableApplicationContext context = SpringApplication.run(JournalApplication.class, args);
		ConfigurableEnvironment environment = context.getEnvironment();
		String[] profiles = environment.getActiveProfiles();
		System.out.println("Active profile: " + (profiles.length > 0 ? profiles[0] : "default"));
	}

	private static void applySanitizedEnvOverrides() {
		String mongoUri = sanitizeEnvValue(System.getenv("MONGODB_URI"));
		if (mongoUri != null && !mongoUri.isBlank()) {
			System.setProperty("spring.data.mongodb.uri", mongoUri);
		}

		String jwtSecretKey = sanitizeEnvValue(System.getenv("JWT_SECRET_KEY"));
		if (jwtSecretKey != null && !jwtSecretKey.isBlank()) {
			System.setProperty("JWT_SECRET_KEY", jwtSecretKey);
		}
	}

	private static String sanitizeEnvValue(String value) {
		if (value == null) {
			return null;
		}
		String trimmed = value.trim();
		if (trimmed.length() >= 2) {
			boolean singleQuoted = trimmed.startsWith("'") && trimmed.endsWith("'");
			boolean doubleQuoted = trimmed.startsWith("\"") && trimmed.endsWith("\"");
			if (singleQuoted || doubleQuoted) {
				return trimmed.substring(1, trimmed.length() - 1).trim();
			}
		}
		return trimmed;
	}

	@Bean
	public PlatformTransactionManager mongoTransactionManager(MongoDatabaseFactory dbFactory) {
		return new MongoTransactionManager(dbFactory);
	}

	@Bean
	public RestTemplate restTemplate()
	{
		return new RestTemplate();
	}


}
