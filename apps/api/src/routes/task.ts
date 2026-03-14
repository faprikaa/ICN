import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { tasks } from "../schema";
import { TaskCreateSchema, TaskUpdateSchema } from "../validation";
import { JWT_SECRET } from "../auth";

export const taskRoutes = new Elysia({ prefix: "/tasks" })
  .use(jwt({ name: "jwt", secret: JWT_SECRET }))
  .derive(async ({ jwt, headers }) => {
    const authorization = headers.authorization;
    if (authorization?.startsWith("Bearer ")) {
      const token = authorization.slice(7);
      const profile = await jwt.verify(token);
      if (profile) return { user: profile as { id: number; email: string } };
    }
    return { user: null as { id: number; email: string } | null };
  })
  .post(
    "/",
    async ({ body, user, set }) => {
      if (!user) {
        set.status = 401;
        return { message: "Unauthorized" };
      }
      const { title, description } = body;
      try {
        const result = await db
          .insert(tasks)
          .values({ title, description, userId: user.id })
          .returning();
        set.status = 201;
        return result[0];
      } catch (e: any) {
        set.status = 400;
        return { message: "Failed to create task" };
      }
    },
    {
      body: TaskCreateSchema,
      detail: {
        summary: "Create a new task",
        description:
          "Creates a task assigned to the authenticated user. Requires a valid JWT token in the Authorization header.",
        tags: ["Tasks"],
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .get(
    "/",
    async () => {
      return db.select().from(tasks);
    },
    {
      detail: {
        summary: "List all tasks",
        description:
          "Returns all tasks in the system. This is a public endpoint — no authentication required.",
        tags: ["Tasks"],
      },
    },
  )
  .get(
    "/my-tasks",
    async ({ user, set }) => {
      if (!user) {
        set.status = 401;
        return { message: "Unauthorized" };
      }
      return db.select().from(tasks).where(eq(tasks.userId, user.id));
    },
    {
      detail: {
        summary: "Get my tasks",
        description:
          "Returns all tasks belonging to the authenticated user. Requires a valid JWT token.",
        tags: ["Tasks"],
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .get(
    "/:id",
    async ({ params, set }) => {
      const records = await db
        .select()
        .from(tasks)
        .where(eq(tasks.id, Number(params.id)))
        .limit(1);
      if (!records[0]) {
        set.status = 404;
        return { message: "Task not found" };
      }
      return records[0];
    },
    {
      detail: {
        summary: "Get task by ID",
        description:
          "Returns a single task by its ID. Returns 404 if the task does not exist. This is a public endpoint.",
        tags: ["Tasks"],
      },
    },
  )
  .put(
    "/:id",
    async ({ params, body, user, set }) => {
      if (!user) {
        set.status = 401;
        return { message: "Unauthorized" };
      }
      const records = await db
        .select()
        .from(tasks)
        .where(eq(tasks.id, Number(params.id)))
        .limit(1);
      const task = records[0];
      if (!task) {
        set.status = 404;
        return { message: "Task not found" };
      }
      if (task.userId !== user.id) {
        set.status = 403;
        return { message: "Forbidden" };
      }
      try {
        const { title, description, completed } = body;
        const updateData: Record<string, string | boolean> = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (completed !== undefined) updateData.completed = completed;
        if (Object.keys(updateData).length === 0)
          return { message: "No fields to update" };
        await db
          .update(tasks)
          .set(updateData)
          .where(eq(tasks.id, Number(params.id)));
        return { message: "Task updated" };
      } catch (e: any) {
        set.status = 400;
        return { message: "Failed to update task" };
      }
    },
    {
      body: TaskUpdateSchema,
      detail: {
        summary: "Update a task",
        description:
          "Update the title, description, or completion status of a task. Only the task owner can update it. Requires a valid JWT token.",
        tags: ["Tasks"],
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .delete(
    "/:id",
    async ({ params, user, set }) => {
      if (!user) {
        set.status = 401;
        return { message: "Unauthorized" };
      }
      const records = await db
        .select()
        .from(tasks)
        .where(eq(tasks.id, Number(params.id)))
        .limit(1);
      const task = records[0];
      if (!task) {
        set.status = 404;
        return { message: "Task not found" };
      }
      if (task.userId !== user.id) {
        set.status = 403;
        return { message: "Forbidden" };
      }
      await db.delete(tasks).where(eq(tasks.id, Number(params.id)));
      return { message: "Task deleted" };
    },
    {
      detail: {
        summary: "Delete a task",
        description:
          "Permanently delete a task by its ID. Only the task owner can delete it. Returns 404 if the task does not exist, 403 if the user is not the owner.",
        tags: ["Tasks"],
        security: [{ bearerAuth: [] }],
      },
    },
  );
