# 📝 Journal App

Welcome to the **Journal App** — a secure, feature-rich platform for personal journaling with sentiment analysis, weather integration, and comprehensive user management. Built with Spring Boot 3.x, MongoDB, Redis, and JWT authentication.

---

## 🚀 Features

### 🔐 **Authentication & Security**
- **JWT-based Authentication** with secure token management
- **User Registration & Login** with password encryption (BCrypt)
- **Role-based Access Control** (USER, ADMIN roles)
- **Stateless Session Management**

### 📝 **Journal Management**
- **CRUD Operations** for journal entries
- **Sentiment Analysis** with automatic categorization (HAPPY, SAD, ANGRY, ANXIOUS)
- **User-specific Journal Entries** with secure access
- **Real-time Entry Management**

### 🌦️ **Weather Integration**
- **Weather-based Greetings** with current conditions
- **Redis Caching** for weather data (5-minute TTL)
- **Multi-city Support** with automatic cache refresh
- **Weather API Integration** (WeatherStack)

### 📧 **Email Services**
- **Scheduled Sentiment Reports** (every 10 minutes)
- **Weekly Sentiment Analysis** emails for users
- **Automated Email Notifications**

### ⚙️ **System Features**
- **Profile-based Configuration** (dev/prod environments)
- **MongoDB Integration** with automatic indexing
- **Redis Caching** for performance optimization
- **Scheduled Jobs** for maintenance tasks
- **Comprehensive Logging** with Logback
- **Docker Support** for containerized deployment
- **Swagger/OpenAPI 3** documentation

---

## 🛠️ Tech Stack

### **Backend Framework**
- **Java 17** with Spring Boot 3.2.5
- **Spring Security** for authentication & authorization
- **Spring Data MongoDB** for database operations
- **Spring Data Redis** for caching
- **Spring Mail** for email services

### **Database & Caching**
- **MongoDB** (Atlas cloud database)
- **Redis** for session and weather data caching
- **MongoDB Atlas** for cloud database hosting

### **Security & Authentication**
- **JWT (JSON Web Tokens)** for stateless authentication
- **BCrypt** password hashing
- **Spring Security** with custom filters

### **Documentation & Testing**
- **Swagger/OpenAPI 3** for API documentation
- **Spring Boot Test** for unit testing
- **JUnit 5** for test framework

### **DevOps & Deployment**
- **Docker** for containerization
- **Maven** for build management
- **Lombok** for reducing boilerplate code

---

## 📦 Project Architecture

```
Journal-App/
├── src/main/java/com/tothenew/journalApp/
│   ├── api/response/
│   │   └── WeatherResponse.java          # Weather API response models
│   ├── cache/
│   │   └── AppCache.java                 # Application configuration cache
│   ├── config/
│   │   ├── OpenApiConfig.java            # Swagger/OpenAPI configuration
│   │   ├── RedisConfig.java              # Redis connection configuration
│   │   ├── SpringSecurityDev.java        # Development security config
│   │   └── SpringSecurityProd.java       # Production security config
│   ├── controller/
│   │   ├── AdminController.java          # Admin-only endpoints
│   │   ├── JournalEntryController.java   # Legacy journal controller
│   │   ├── JournalEntryControllerV2.java # Main journal controller
│   │   ├── PublicController.java         # Public endpoints (auth)
│   │   └── UserController.java           # User management endpoints
│   ├── entity/
│   │   ├── ConfigJournalAppEntity.java   # Configuration entity
│   │   ├── JournalEntry.java             # Journal entry model
│   │   └── User.java                     # User model
│   ├── enums/
│   │   └── Sentiment.java                # Sentiment analysis enum
│   ├── filter/
│   │   └── JwtFilter.java                # JWT authentication filter
│   ├── repository/
│   │   ├── ConfigJournalAppRepository.java
│   │   ├── JournalEntryRepository.java
│   │   ├── UserRepository.java
│   │   └── UserRepositoryImpl.java
│   ├── scheduler/
│   │   └── UserScheduler.java            # Scheduled jobs
│   ├── service/
│   │   ├── EmailService.java             # Email functionality
│   │   ├── JournalEntryService.java      # Journal business logic
│   │   ├── RedisService.java             # Redis operations
│   │   ├── UserDetailsServiceImpl.java   # Spring Security user details
│   │   ├── UserService.java              # User business logic
│   │   └── WeatherService.java           # Weather API integration
│   ├── utils/
│   │   └── JwtUtil.java                  # JWT token utilities
│   └── JournalApplication.java           # Main application class
├── src/main/resources/
│   ├── application-dev.yaml              # Development configuration
│   ├── application-prod.yaml             # Production configuration
│   ├── application.properties            # Common properties
│   └── logback.xml                       # Logging configuration
├── src/test/                             # Test files
├── Dockerfile                            # Docker configuration
├── pom.xml                               # Maven dependencies
└── Readme.md                             # This file
```

---

## ⚙️ Configuration

### **Environment Profiles**
- **Development (`dev`)**: Port 8080, detailed logging, Swagger enabled
- **Production (`prod`)**: Port 8081, optimized settings, basic auth

### **Database Configuration**
```yaml
spring:
  data:
    mongodb:
      uri: mongodb+srv://[username]:[password]@journal.gnjq81h.mongodb.net/
      database: journaldb
      auto-index-creation: true
```

### **Redis Configuration**
```yaml
spring:
  redis:
    host: localhost
    port: 6379
    timeout: 2000ms
```

### **Weather API Configuration**
```yaml
weather:
  api:
    key: your_weather_api_key
```

### **Email Configuration**
```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: your_email@gmail.com
    password: your_app_password
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
```

---

## 🏁 Getting Started

### **Prerequisites**
- **Java 17** or higher
- **Maven 3.8+**
- **MongoDB** (local or MongoDB Atlas)
- **Redis** (local or cloud)
- **Weather API Key** (WeatherStack recommended)

### **Local Development Setup**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Zubair7102/Journal-App.git
   cd Journal-App
   ```

2. **Configure Environment**
   - Copy `application-dev.yaml` and update with your credentials
   - Set up MongoDB Atlas or local MongoDB
   - Configure Redis connection
   - Add Weather API key

3. **Build and Run**
   ```bash
   # Build the project
   ./mvnw clean package

   # Run with development profile
   ./mvnw spring-boot:run -Dspring.profiles.active=dev
   
   # Or run the JAR directly
   java -jar target/journalApp-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
   ```

4. **Access the Application**
   - **API Base URL**: `http://localhost:8080`
   - **Swagger UI**: `http://localhost:8080/swagger-ui.html`
   - **Health Check**: `http://localhost:8080/public/health-check`

---

## 🐳 Docker Deployment

### **Build Docker Image**
```bash
docker build -t journal-app .
```

### **Run Container**
```bash
# Development
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=dev \
  -e MONGODB_URI=your_mongodb_uri \
  -e REDIS_HOST=your_redis_host \
  journal-app

# Production
docker run -p 8081:8081 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e MONGODB_URI=your_mongodb_uri \
  -e REDIS_HOST=your_redis_host \
  journal-app
```

---

## 🔑 API Endpoints

### **Public Endpoints** (No Authentication Required)
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/public/health-check` | Application health status | - | `"OK"` |
| `POST` | `/public/signup` | User registration | `User` object | JWT token or error |
| `POST` | `/public/login` | User authentication | `User` credentials | JWT token or error |

### **User Endpoints** (JWT Authentication Required)
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `PUT` | `/user` | Update user profile | `User` object | Updated user |
| `DELETE` | `/user` | Delete user account | - | 204 No Content |
| `GET` | `/user/greet` | Weather-based greeting | Query param: `cityName` | Greeting message |

### **Journal Endpoints** (JWT Authentication Required)
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/journal` | Get user's journal entries | - | List of entries |
| `POST` | `/journal` | Create new journal entry | `JournalEntry` object | Created entry |
| `GET` | `/journal/id/{id}` | Get specific entry | - | Journal entry |
| `PUT` | `/journal/id/{id}` | Update journal entry | `JournalEntry` object | Updated entry |
| `DELETE` | `/journal/id/{id}` | Delete journal entry | - | 204 No Content |

### **Admin Endpoints** (ADMIN Role Required)
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/admin/all-users` | List all users | - | List of users |
| `GET` | `/admin/all-journals` | List all journal entries | - | List of entries |
| `POST` | `/admin/create-admin-user` | Create admin user | `User` object | - |
| `GET` | `/admin/clear-app-cache` | Refresh application cache | - | - |

### **Legacy Endpoints** (Deprecated)
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| `GET` | `/_journal` | Get all entries (legacy) | Deprecated |
| `POST` | `/_journal` | Create entry (legacy) | Deprecated |

---

## 📚 API Documentation (Swagger/OpenAPI 3)

The Journal App includes comprehensive API documentation powered by **Swagger/OpenAPI 3** with interactive testing capabilities and detailed schema documentation.

### **🔗 Accessing Swagger UI**

#### **Development Environment**
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/api-docs`
- **OpenAPI YAML**: `http://localhost:8080/api-docs.yaml`

#### **Production Environment**
- **Swagger UI**: `http://localhost:8081/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8081/api-docs`
- **OpenAPI YAML**: `http://localhost:8081/api-docs.yaml`

#### **Docker Environment**
- **Development**: `http://localhost:8080/swagger-ui.html`
- **Production**: `http://localhost:8081/swagger-ui.html`

### **✨ Swagger Features**

#### **Interactive API Testing**
- **Real-time Testing**: Execute API calls directly from the browser
- **Request Builder**: Automatic request body generation
- **Response Viewer**: Formatted JSON response display
- **Error Handling**: Detailed error messages and status codes

#### **Authentication Support**
- **JWT Bearer Token**: Built-in authentication for protected endpoints
- **Authorize Button**: Easy token management in Swagger UI
- **Token Validation**: Automatic token format validation
- **Security Schemes**: Proper OpenAPI 3 security definitions

#### **Comprehensive Documentation**
- **Endpoint Descriptions**: Detailed explanations for each API
- **Request/Response Examples**: Sample payloads and responses
- **Schema Documentation**: Complete data model definitions
- **HTTP Status Codes**: All possible response codes documented
- **Parameter Validation**: Input validation rules and constraints

#### **Developer Experience**
- **Code Generation**: Export client SDKs in multiple languages
- **API Versioning**: Support for multiple API versions
- **Search & Filter**: Easy endpoint discovery and filtering
- **Responsive Design**: Works on desktop and mobile devices

### **🔐 Using Swagger UI with Authentication**

#### **Step 1: Access Swagger UI**
1. Navigate to the Swagger UI URL for your environment
2. You'll see the API documentation with all available endpoints

#### **Step 2: Authenticate (for Protected Endpoints)**
1. Click the **"Authorize"** button at the top of the page
2. In the authorization dialog, enter your JWT token:
   ```
   Bearer your_jwt_token_here
   ```
3. Click **"Authorize"** to save the token
4. Close the dialog

#### **Step 3: Test Endpoints**
1. **Expand** the endpoint you want to test
2. Click **"Try it out"** button
3. **Fill in** required parameters and request body
4. Click **"Execute"** to make the API call
5. **Review** the response and status code

### **📋 API Endpoints Documentation**

#### **Public Endpoints** (No Authentication Required)
| Endpoint | Method | Description | Swagger Tag |
|----------|--------|-------------|-------------|
| `/public/health-check` | GET | Application health status | Public API |
| `/public/signup` | POST | User registration | Public API |
| `/public/login` | POST | User authentication | Public API |

#### **Protected Endpoints** (JWT Authentication Required)
| Endpoint | Method | Description | Swagger Tag |
|----------|--------|-------------|-------------|
| `/user` | PUT | Update user profile | User Management |
| `/user` | DELETE | Delete user account | User Management |
| `/user/greet` | GET | Weather-based greeting | User Management |
| `/journal` | GET | Get user's journal entries | Journal Management |
| `/journal` | POST | Create new journal entry | Journal Management |
| `/journal/id/{id}` | GET | Get specific entry | Journal Management |
| `/journal/id/{id}` | PUT | Update journal entry | Journal Management |
| `/journal/id/{id}` | DELETE | Delete journal entry | Journal Management |

#### **Admin Endpoints** (ADMIN Role Required)
| Endpoint | Method | Description | Swagger Tag |
|----------|--------|-------------|-------------|
| `/admin/all-users` | GET | List all users | Admin Management |
| `/admin/all-journals` | GET | List all journal entries | Admin Management |
| `/admin/create-admin-user` | POST | Create admin user | Admin Management |
| `/admin/clear-app-cache` | GET | Refresh application cache | Admin Management |

### **📊 Data Models Documentation**

#### **User Model**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "userName": "john_doe",
  "password": "encrypted_password",
  "email": "john.doe@example.com",
  "sentimentAnalysis": true,
  "roles": ["USER"],
  "journalEntries": []
}
```

#### **Journal Entry Model**
```json
{
  "id": "507f1f77bcf86cd799439012",
  "title": "My Journal Entry",
  "content": "Today was an amazing day...",
  "date": "2024-01-15T10:30:00",
  "sentiment": "HAPPY"
}
```

#### **Weather Response Model**
```json
{
  "location": {
    "name": "New York",
    "country": "United States of America",
    "region": "New York"
  },
  "current": {
    "temperature": 22,
    "feelslike": 24,
    "weather_descriptions": ["Partly cloudy"],
    "humidity": 65
  }
}
```

### **🔧 Swagger Configuration**

#### **OpenAPI Configuration** (`OpenApiConfig.java`)
```java
@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Journal App API")
                .description("A secure E2EE Journal Application API")
                .version("1.0.0"))
            .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
            .components(new Components()
                .addSecuritySchemes("Bearer Authentication", 
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")));
    }
}
```

#### **Application Properties**
```properties
# Swagger/OpenAPI Configuration
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.operationsSorter=method
springdoc.swagger-ui.tagsSorter=alpha
springdoc.swagger-ui.doc-expansion=none
springdoc.swagger-ui.disable-swagger-default-url=true
```

### **🚀 Getting Started with Swagger**

#### **Quick Start Guide**
1. **Start the Application**
   ```bash
   # Development
   ./mvnw spring-boot:run -Dspring.profiles.active=dev
   
   # Or with Docker
   docker-compose up -d
   ```

2. **Access Swagger UI**
   - Open browser and navigate to: `http://localhost:8080/swagger-ui.html`

3. **Test Authentication**
   - Use the `/public/signup` endpoint to create a user
   - Use the `/public/login` endpoint to get a JWT token
   - Click "Authorize" and enter: `Bearer your_token_here`

4. **Test Protected Endpoints**
   - Expand any protected endpoint
   - Click "Try it out"
   - Execute the request

#### **Example API Testing Workflow**
1. **Create User**: POST `/public/signup`
   ```json
   {
     "userName": "testuser",
     "password": "password123",
     "email": "test@example.com",
     "sentimentAnalysis": true
   }
   ```

2. **Login**: POST `/public/login`
   ```json
   {
     "userName": "testuser",
     "password": "password123"
   }
   ```
   - Copy the JWT token from the response

3. **Authorize**: Click "Authorize" and enter `Bearer your_jwt_token`

4. **Create Journal Entry**: POST `/journal`
   ```json
   {
     "title": "My First Entry",
     "content": "This is my first journal entry",
     "sentiment": "HAPPY"
   }
   ```

### **📱 Mobile and External Integration**

#### **API Client Generation**
Swagger UI provides code generation for various programming languages:
- **JavaScript/TypeScript**: Axios, Fetch API
- **Python**: Requests, urllib
- **Java**: OkHttp, RestTemplate
- **C#**: HttpClient
- **PHP**: Guzzle, cURL

#### **External Tools Integration**
- **Postman**: Import OpenAPI specification
- **Insomnia**: Direct API specification import
- **VS Code**: REST Client extension
- **IntelliJ IDEA**: HTTP Client

### **🔍 Troubleshooting Swagger**

#### **Common Issues**
1. **Swagger UI Not Loading**
   - Check if application is running
   - Verify the correct port (8080 for dev, 8081 for prod)
   - Check browser console for errors

2. **Authentication Issues**
   - Ensure JWT token is in correct format: `Bearer token_here`
   - Check if token is expired
   - Verify token was generated from `/public/login`

3. **CORS Issues**
   - Swagger UI is served from the same origin
   - No CORS configuration needed for local development

4. **Endpoint Not Found**
   - Check if the endpoint is available in your profile (dev/prod)
   - Verify the correct base URL

#### **Security Considerations**
- **Development**: Swagger UI is enabled for easy testing
- **Production**: Consider disabling Swagger UI in production
- **Authentication**: Always use HTTPS in production
- **Token Security**: Never share JWT tokens publicly

---

## 🔒 Security Implementation

### **JWT Authentication Flow**
1. **Login**: User provides credentials → JWT token generated
2. **Request**: Client includes JWT in Authorization header
3. **Validation**: JwtFilter validates token and sets authentication
4. **Access**: Spring Security grants access based on roles

### **Password Security**
- **BCrypt Hashing**: All passwords encrypted with BCrypt
- **Salt Generation**: Automatic salt generation for each password
- **Secure Storage**: Encrypted passwords stored in MongoDB

### **Token Management**
- **JWT Secret**: Secure secret key for token signing
- **Token Expiration**: 1-hour token validity
- **Stateless**: No server-side session storage

### **Role-based Access Control**
- **USER Role**: Access to personal journal entries and profile
- **ADMIN Role**: Access to all users and system management
- **Public Endpoints**: Health check, signup, and login

---

## 🌦️ Weather Integration

### **Features**
- **Real-time Weather Data**: Current conditions for any city
- **Redis Caching**: 5-minute cache to reduce API calls
- **Automatic Refresh**: Scheduled cache refresh every 10 minutes
- **Error Handling**: Graceful fallback for API failures

### **Usage**
```bash
GET /user/greet?cityName=New%20York
Authorization: Bearer <jwt_token>
```

### **Response**
```
"Hi john_doe Weather feels like 24"
```

---

## ⏰ Scheduled Jobs

### **Sentiment Analysis Email** (Every 10 minutes)
- **Purpose**: Send weekly sentiment reports to users
- **Trigger**: Cron job `0 */10 * * * *`
- **Process**: 
  1. Fetch users with sentiment analysis enabled
  2. Analyze last 7 days of journal entries
  3. Calculate most frequent sentiment
  4. Send email with sentiment summary

### **Cache Refresh** (Every 10 minutes)
- **Purpose**: Refresh application configuration cache
- **Trigger**: Cron job `0 */10 * * * *`
- **Process**: Reload configuration from MongoDB

---

## 📧 Email Services

### **Configuration**
```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: your_email@gmail.com
    password: your_app_password
```

### **Features**
- **Scheduled Emails**: Automatic sentiment reports
- **Error Handling**: Graceful failure handling
- **Logging**: Comprehensive email operation logging

---
