# Multi-stage build for optimized production image
# Build stage
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build

# Set working directory
WORKDIR /app

# Copy Maven configuration files first for better layer caching
COPY pom.xml .
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests -B

# Production stage
FROM eclipse-temurin:17-jre-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S journalapp && \
    adduser -u 1001 -S journalapp -G journalapp

# Set working directory
WORKDIR /app

# Copy the built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Change ownership to non-root user
RUN chown -R journalapp:journalapp /app

# Switch to non-root user
USER journalapp

# Set environment variables
ENV JAVA_OPTS="-Xmx1024m -Xms512m -XX:+UseG1GC -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
ENV SPRING_PROFILES_ACTIVE=prod
ENV TZ=UTC

# Create health check directory
RUN mkdir -p /app/health

# Expose the application port (8081 for production)
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8081/public/health-check || exit 1

# Command to run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

# Development stage (optional)
FROM eclipse-temurin:17-jre-alpine AS development

# Create non-root user for security
RUN addgroup -g 1001 -S journalapp && \
    adduser -u 1001 -S journalapp -G journalapp

# Set working directory
WORKDIR /app

# Copy the built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Change ownership to non-root user
RUN chown -R journalapp:journalapp /app

# Switch to non-root user
USER journalapp

# Set environment variables for development
ENV JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseG1GC -XX:+UseContainerSupport -XX:MaxRAMPercentage=50.0"
ENV SPRING_PROFILES_ACTIVE=dev
ENV TZ=UTC

# Expose the development port (8080)
EXPOSE 8080

# Health check for development
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/public/health-check || exit 1

# Command to run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"] 