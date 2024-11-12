# IS442 T5 Timperio Project

## Tech Stack

- [React.js](https://react.dev)
- [Refine](https://refine.dev)
- [Java Spring Boot](https://spring.io/projects/spring-boot)
- [PostgreSQL](https://www.postgresql.org)

## Getting Started

1. Clone the project

   ```
   git clone https://github.com/SMU-IS/Timperio
   ```

2. Install dependencies

   ```
   cd frontend
   npm install
   ```

   ```
   cd backend
   mvn clean install -U
   ```

3. Set up environment variables, create the file `.env` at `backend/.env`

   ```
   DB_URL=jdbc:postgresql://localhost:5432/timperiodb
   DB_USERNAME=postgres
   DB_PASSWORD=root
   PYTHON_DB_URL=postgresql://postgres:root@localhost:5432/timperiodb
   JWT_SECRET_KEY={JWT_SECRET_KEY}
   SERVER=//localhost:5173
   MAILCHIMP_API_KEY={MAILCHIMP_API_KEY}
   ```

4. Run the project in development environment

   ```
   frontend - npm run dev
   backend - mvn spring-boot:run
   ```

## API Documentation

```
http://localhost:8080/swagger-ui/index.html
```

## Acknowledgements

Developed by Team 5
