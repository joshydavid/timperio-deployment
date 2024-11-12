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
${import.meta.env.VITE_SERVER}/swagger-ui/index.html
```

## Acknowledgements

Developed by Team 5

<a href="https://www.linkedin.com/in/joshydavid/">
  <img src="https://github.com/user-attachments/assets/4dfe0c89-8ced-4e08-bcf3-6261bdbb956d" width="80">
</a> &nbsp;

<a href="https://www.linkedin.com/in/derricklkh/">
  <img src="https://github.com/user-attachments/assets/2db4b711-b7d0-4368-8d12-6449c3fa2aa2" width="80">
</a> &nbsp;

<a href="https://www.linkedin.com/in/shawn-ng-yh/">
  <img src="https://github.com/user-attachments/assets/6bd4f3a7-6784-402a-b891-03d91e15d705" width="80">
</a> &nbsp;

<a href="https://www.linkedin.com/in/ivynyak/">
  <img src="https://github.com/user-attachments/assets/24522f87-6fb8-4b48-94d8-8022eb571e96" width="80">
</a> &nbsp;

<!-- <a href="https://www.linkedin.com/in/liawjunyi/">
  <img src="https://github.com/user-attachments/assets/24522f87-6fb8-4b48-94d8-8022eb571e96" width="80">
</a> -->
