# School ERP Backend (Express + Sutando ORM + MySQL)

Modern Node.js REST API for School ERP administration built using **Express**, **[Sutando ORM](https://sutando.org/)**, and **MySQL**.

## Features

- **Active Record ORM**: Built on Sutando's Eloquent-inspired architecture.
- **MySQL Integration**: Optimized connection pooling via `mysql2`.
- **Domain Models & Relationships**: Organizations, Branches, Academic Years, Classes, Sections, Students, Subjects, Attendance, and Communications.
- **Schema Migrations**: Schema builder migrations with `npm run migrate`.
- **Database Seeder**: Initial trust, branch, and sample data with `npm run seed`.

## Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment (`.env`)
Edit `backend/.env` with your MySQL credentials or provide a `DATABASE_URL`:
```env
PORT=5000
NODE_ENV=development

# MySQL Credentials:
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_erp

# Or full connection URL:
# DATABASE_URL=mysql://user:password@host:3306/school_erp
```

### 3. Run Database Migrations
Create all MySQL tables automatically:
```bash
npm run migrate
```

### 4. (Optional) Seed Sample Data
```bash
npm run seed
```

### 5. Start Server
```bash
# Production / standard start:
npm start

# Development mode with auto-reload:
npm run dev
```

Server runs by default at `http://localhost:5000`.
