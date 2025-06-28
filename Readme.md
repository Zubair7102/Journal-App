# 📝 Journal App

Welcome to the **Journal App** — a secure, user-friendly platform for writing, editing, and managing personal journal entries, built with Spring Boot, MongoDB, and Redis.

---

## 🚀 Features
- **User Registration & Authentication** (with roles: USER, ADMIN)
- **Create, Read, Update, Delete (CRUD) Journal Entries**
- **Admin endpoints** for user and journal management
- **Weather integration**: Get weather-based greetings
- **MongoDB** for persistent storage
- **Redis caching** for weather data (improves performance and reduces API calls)
- **Scheduled jobs** for cache refresh and weekly sentiment analysis emails
- **Profile-based configuration** (dev/prod)
- **RESTful API** with clear endpoint structure
- **Dockerized** for easy deployment

---

## 🛠️ Tech Stack
- Java 17
- Spring Boot 3.x
- Spring Data MongoDB
- Spring Data Redis
- Spring Security
- Lombok
- Docker
- Maven

---

## 📦 Project Structure
```
Journal-App/
├── src/main/java/com/tothenew/journalApp/
│   ├── api/response/WeatherResponse.java
│   ├── cache/AppCache.java
│   ├── config/SpringSecurityDev.java, SpringSecurityProd.java, RedisConfig.java
│   ├── controller/...
│   ├── entity/User.java, JournalEntry.java, ConfigJournalAppEntity.java
│   ├── repository/...
│   ├── scheduler/UserScheduler.java
│   ├── service/RedisService.java, WeatherService.java, ...
│   └── JournalApplication.java
├── src/main/resources/
│   ├── application.yaml, application-dev.yaml, application-prod.yaml
│   ├── logback.xml
│   └── ...
├── Dockerfile
├── pom.xml
└── Readme.md
```

---

## ⚙️ Configuration
- **Profiles:**
  - `dev` (default): uses `application-dev.yaml` (port 8080)
  - `prod`: uses `application-prod.yaml` (port 8081)
- **MongoDB:**
  - URI and database are set in the profile YAML files.
- **Redis:**
  - Add to your YAML:
    ```yaml
    spring:
      redis:
        host: localhost
        port: 6379
    ```
  - Make sure Redis is running and accessible.
- **Weather API:**
  - API key and endpoint are set in `application.yaml` and loaded via `AppCache`.
- **Logging:**
  - Console and file logging via `logback.xml`.

---

## 🏁 Getting Started

### Prerequisites
- Java 17+
- Maven
- MongoDB (local or cloud, see config)
- Redis (local or cloud, see config)

### Local Development
```bash
# Clone the repo
 git clone <repo-url>
 cd Journal-App

# Build the project
 ./mvnw clean package

# Run with dev profile (default)
 ./mvnw spring-boot:run
# Or run the JAR
 java -jar target/*.jar
```

### Configuration
- Edit `src/main/resources/application-dev.yaml` or `application-prod.yaml` for DB, Redis, and server settings.
- Set `SPRING_PROFILES_ACTIVE` to `prod` for production.

---

## 🐳 Docker

### Build & Run
```bash
# Build the Docker image
 docker build -t journal-app .

# Run the container (default: prod profile)
 docker run -p 8081:8081 --env SPRING_PROFILES_ACTIVE=prod journal-app
```
- The app will use the `prod` profile by default in Docker.
- Ensure MongoDB and Redis are accessible from the container.

---

## 🔑 API Endpoints

### Public
- `GET /public/health-check` — Health check
- `POST /public/create-user` — Register a new user

### User (requires authentication)
- `PUT /user` — Update user info
- `DELETE /user` — Delete user
- `GET /user/greet?cityName=City` — Weather-based greeting

### Journal (requires authentication)
- `GET /journal` — Get all journal entries for the user
- `POST /journal` — Create a new journal entry
- `GET /journal/id/{id}` — Get a journal entry by ID
- `PUT /journal/id/{id}` — Update a journal entry by ID
- `DELETE /journal/id/{id}` — Delete a journal entry by ID

### Admin (requires ADMIN role)
- `GET /admin/all-users` — List all users
- `GET /admin/all-journals` — List all journal entries
- `POST /admin/create-admin-user` — Create an admin user
- `GET /admin/clear-app-cache` — Refreshes the application cache

---

## 🗄️ Data Models

### User
```json
{
  "userName": "string",
  "password": "string",
  "email": "string",
  "sentimentAnalysis": true,
  "roles": ["USER", "ADMIN"],
  "journalEntries": [ ... ]
}
```

### JournalEntry
```json
{
  "id": "ObjectId",
  "title": "string",
  "content": "string",
  "date": "ISODateTime",
  "sentiment": "POSITIVE|NEGATIVE|NEUTRAL"
}
```

---

## 🔒 Security
- HTTP Basic Auth (username/password)
- Role-based access (USER, ADMIN)
- Passwords are hashed with BCrypt

---

## 🌦️ Weather Integration & Caching
- Uses a weather API (see `weather.api.key` in config)
- Caches weather data in Redis for 5 minutes per city
- Endpoint: `/user/greet?cityName=City`

---

## ⏰ Scheduled Jobs
- **Sentiment Analysis Email:** Every 10 minutes, users with sentiment analysis enabled receive a summary email of their last 7 days' journal sentiment.
- **Cache Refresh:** Every 10 minutes, the application cache is refreshed.

---
