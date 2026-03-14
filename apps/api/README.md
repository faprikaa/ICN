# Task Manager API

The backend service for the Task Manager application, built with **ElysiaJS** running on the **Bun** runtime.

**Live**: [https://api.icn.muammar.web.id](https://api.icn.muammar.web.id/)
**Swagger**: [https://api.icn.muammar.web.id/swagger](https://api.icn.muammar.web.id/swagger)

## Tech Stack

| Category       | Technology                                                            |
| -------------- | --------------------------------------------------------------------- |
| Framework      | [ElysiaJS](https://elysiajs.com/)                                     |
| Runtime        | [Bun](https://bun.sh/)                                                |
| Database ORM   | [Drizzle ORM](https://orm.drizzle.team/)                              |
| Database       | PostgreSQL ([postgres.js](https://github.com/porsager/postgres))      |
| Validation     | [Typebox](https://github.com/sinclairzx81/typebox) (via Elysia `t`)   |
| Authentication | JWT ([`@elysiajs/jwt`](https://elysiajs.com/plugins/jwt))             |
| API Docs       | Swagger ([`@elysiajs/swagger`](https://elysiajs.com/plugins/swagger)) |
| CORS           | [`@elysiajs/cors`](https://elysiajs.com/plugins/cors)                 |

## API Endpoints

### Authentication

| Method | Endpoint       | Description                   | Auth |
| ------ | -------------- | ----------------------------- | ---- |
| `POST` | `/users/login` | Login with email and password | No   |
| `POST` | `/users`       | Register a new user           | No   |

### Users

| Method   | Endpoint           | Description          | Auth |
| -------- | ------------------ | -------------------- | ---- |
| `GET`    | `/users`           | List all users       | No   |
| `GET`    | `/users/:id`       | Get user by ID       | No   |
| `PUT`    | `/users/:id`       | Update user          | No   |
| `DELETE` | `/users/:id`       | Delete user          | No   |
| `GET`    | `/users/:id/tasks` | Get tasks by user ID | No   |

### Tasks

| Method   | Endpoint          | Description                    | Auth   |
| -------- | ----------------- | ------------------------------ | ------ |
| `POST`   | `/tasks`          | Create a new task              | Bearer |
| `GET`    | `/tasks`          | List all tasks                 | No     |
| `GET`    | `/tasks/my-tasks` | Get authenticated user's tasks | Bearer |
| `GET`    | `/tasks/:id`      | Get task by ID                 | No     |
| `PUT`    | `/tasks/:id`      | Update a task (owner only)     | Bearer |
| `DELETE` | `/tasks/:id`      | Delete a task (owner only)     | Bearer |

> All authenticated endpoints require a `Authorization: Bearer <token>` header. Obtain a token via `POST /users/login`.

## Database Schema

```sql
-- users
CREATE TABLE users (
  id        SERIAL PRIMARY KEY,
  name      TEXT NOT NULL,
  email     TEXT NOT NULL UNIQUE,
  password  TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- tasks
CREATE TABLE tasks (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  completed   BOOLEAN DEFAULT FALSE NOT NULL,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW() NOT NULL
);
```

## Project Structure

```
apps/api/
├── src/
│   ├── index.ts          # App entry point, plugin setup, server start
│   ├── auth.ts           # JWT secret and auth types
│   ├── db.ts             # Drizzle ORM database connection
│   ├── validation.ts     # Typebox validation schemas (Elysia t)
│   ├── schema.ts         # Drizzle table definitions (users, tasks)
│   └── routes/
│       ├── users.ts      # User CRUD + login endpoints
│       └── task.ts       # Task CRUD endpoints
├── drizzle/              # Migration files
├── drizzle.config.ts     # Drizzle Kit configuration
└── package.json
```

## Getting Started

### Environment Variables

```bash
cp .env.example .env
```

| Variable       | Description                            |
| -------------- | -------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string           |
| `JWT_SECRET`   | Secret key for signing JSON Web Tokens |

### Database Setup

Push the schema to your database:

```bash
bunx drizzle-kit push
```

### Development

```bash
# from apps/api directory
bun run dev

# or from the monorepo root
bun run dev --filter=api
```

The server starts at [http://localhost:3001](http://localhost:3001) with Swagger docs at [http://localhost:3001/swagger](http://localhost:3001/swagger).

### Building

```bash
bun run build
```
