# Model-Driven No-Code Platform — Beginner Starter

This is a small learning prototype based on your architecture images.

## What works
- React model designer: add fields and choose data types.
- Model creation: edit the model name and field definitions.
- Model validation: checks model name, field names, and duplicate names.
- Code generation: creates a basic HTML form and lets you download it.
- Spring Boot API: saves/reads model definitions through REST endpoints.
- MySQL integration: Spring Boot configuration included.
- Deployment: Docker files included as a starting point.

## Requirements
- Node.js (LTS)
- Java 17+
- Maven
- MySQL Server

## 1. Start MySQL
Create a database:
```sql
CREATE DATABASE model_platform;
```
If your MySQL username/password differ, edit `backend/src/main/resources/application.properties`.

## 2. Start backend
Open a terminal:
```bash
cd backend
mvn spring-boot:run
```
Backend runs at http://localhost:8080

## 3. Start frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the URL Vite prints (usually http://localhost:5173).

## How to test
1. Enter a model name, e.g. Student Registration.
2. Add fields such as `studentName` (Text), `email` (Email), and `age` (Number).
3. Click Validate Model.
4. Click Save Model to send the definition to Spring Boot/MySQL.
5. Click Generate HTML to download a basic generated form.

## Important beginner note
This is a prototype, not a production-ready platform. The generated HTML is a simple form. Full automatic Java entity/repository/controller generation, authentication, Camunda workflows, Kubernetes, and cloud deployment are future extensions.
