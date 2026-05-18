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

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@SpringBootApplication
@EnableTransactionManagement
public class JournalApplication {

	public static void main(String[] args) {
		loadDotEnvIntoSystemProperties();
		applySanitizedEnvOverrides();
		ConfigurableApplicationContext context = SpringApplication.run(JournalApplication.class, args);
		ConfigurableEnvironment environment = context.getEnvironment();
		String[] profiles = environment.getActiveProfiles();
		System.out.println("Active profile: " + (profiles.length > 0 ? profiles[0] : "default"));
	}

	private static void loadDotEnvIntoSystemProperties() {
		Path envPath = Path.of(".env");
		if (!Files.exists(envPath)) {
			return;
		}
		try {
			List<String> lines = Files.readAllLines(envPath);
			for (String line : lines) {
				String trimmed = line.trim();
				if (trimmed.isEmpty() || trimmed.startsWith("#") || !trimmed.contains("=")) {
					continue;
				}
				int separatorIndex = trimmed.indexOf('=');
				String key = trimmed.substring(0, separatorIndex).trim();
				String rawValue = trimmed.substring(separatorIndex + 1).trim();
				String value = sanitizeEnvValue(rawValue);
				if (key.isEmpty() || value == null) {
					continue;
				}
				// Keep explicit OS environment as highest priority.
				if (System.getenv(key) == null && System.getProperty(key) == null) {
					System.setProperty(key, value);
				}
			}
		} catch (IOException ignored) {
			// If .env can't be read, startup continues and normal env resolution still applies.
		}
	}

	private static void applySanitizedEnvOverrides() {
		String mongoUri = sanitizeEnvValue(resolveProperty("MONGODB_URI"));
		if (mongoUri != null && !mongoUri.isBlank()) {
			System.setProperty("spring.data.mongodb.uri", mongoUri);
		}

		String jwtSecretKey = sanitizeEnvValue(resolveProperty("JWT_SECRET_KEY"));
		if (jwtSecretKey != null && !jwtSecretKey.isBlank()) {
			System.setProperty("JWT_SECRET_KEY", jwtSecretKey);
		}
	}

	private static String resolveProperty(String key) {
		String envValue = System.getenv(key);
		if (envValue != null && !envValue.isBlank()) {
			return envValue;
		}
		return System.getProperty(key);
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
