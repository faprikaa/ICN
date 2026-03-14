import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { userRoutes } from "./routes/users";
import { taskRoutes } from "./routes/task";

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: "Task Manager API",
          version: "1.0.0",
          description:
            "REST API for managing users and tasks. Supports user registration, authentication via JWT, and full CRUD operations on tasks with ownership-based access control.",
        },
        tags: [
          { name: "Auth", description: "Login and registration" },
          { name: "Users", description: "User management (CRUD)" },
          {
            name: "Tasks",
            description: "Task management with ownership-based access control",
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
              description:
                "Obtain a token via POST /users/login, then pass it as: Authorization: Bearer <token>",
            },
          },
        },
      },
    }),
  )
  .get(
    "/",
    () => "Task Manager API is running. Visit /swagger for documentation.",
    {
      detail: {
        summary: "Health check",
        description: "Returns a simple message to confirm the API is running.",
        tags: ["Health"],
      },
    },
  )
  .use(userRoutes)
  .use(taskRoutes)
  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
console.log(
  `📚 Swagger docs at ${app.server?.hostname}:${app.server?.port}/swagger`,
);

export type App = typeof app;
