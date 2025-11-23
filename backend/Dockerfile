# 1. Use an official Java 21 image (This solves the JAVA_HOME error)
FROM eclipse-temurin:21-jdk-jammy

# 2. Set working directory
WORKDIR /app

# 3. Copy your backend code into the container
COPY . .

# 4. Ensure the Maven Wrapper is executable
RUN chmod +x mvnw

# 5. Build the application (Skip tests to be fast)
RUN ./mvnw clean package -DskipTests

# 6. Run the application
# We use 'sh -c' so we can use the wildcard *.jar
CMD ["sh", "-c", "java -jar target/*.jar"]