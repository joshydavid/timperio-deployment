#
![fe workflow](https://github.com/SMU-IS/Timperio/actions/workflows/merged_frontend.yml/badge.svg)  
![be workflow](https://github.com/SMU-IS/Timperio/actions/workflows/merged_backend.yml/badge.svg)  
![cd workflow](https://github.com/SMU-IS/Timperio/actions/workflows/push_to_deployment_repo.yml/badge.svg)  

# IS442 T5 Timperio Project

<img src="https://github.com/user-attachments/assets/200311c1-325e-40c2-a52e-d9858899f441" width="600">
<br>
<br>

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

3. Set up environment variables

   create the file `.env` at `backend/.env`

   ```
   DB_URL=jdbc:postgresql://localhost:5432/timperiodb
   DB_USERNAME=postgres
   DB_PASSWORD=root
   JWT_SECRET_KEY={JWT_SECRET_KEY}
   SERVER=//localhost:5173
   MAILCHIMP_API_KEY={MAILCHIMP_API_KEY}
   FRONT_END_SERVER_URL=https://timperio-t5.vercel.app
   TEMPLATE_DIR=template
   TEMPLATE_FILE_NAME=campaign_template.html
   LOGIN_EMAIL={EMAIL}
   LOGIN_PASSWORD={PASSWORD}
   ```

   create the file `.env` at `frontend/.env`

   ```
   VITE_SERVER=http://localhost:8080
   ```

4. Run the project in development environment

   ```
   frontend - npm run dev
   backend - mvn spring-boot:run
   ```

5. Login credentials

    | Role        | Email                  | Password        |
    | :--------   | :-------               | :-------------- |
    | `ADMIN`     | `admin@timperio.com`     | password123     |
    | `MARKETING` | `marketing@timperio.com` | password123     |
    | `SALES`     | `sales@timperio.com`     | password123     |

6. Populate local database

  ```http
  POST /api/v1/import-data
  ```

## API Documentation

```
http://localhost:8080/swagger-ui/index.html
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
  <img src="https://github.com/user-attachments/assets/1aafcebd-61ae-4cb1-b8be-cf8e99b4fa66" width="80">
</a> &nbsp;

<a href="https://www.linkedin.com/in/liawjunyi/">
  <img src="https://github.com/user-attachments/assets/e4ad01cf-c1ef-4042-899d-6a9f3156485a" width="80">
</a>
