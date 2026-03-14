import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users, tasks } from "../schema";
import { JWT_SECRET, type AuthUser } from "../auth";
import {
  UserRegistrationSchema,
  UserLoginSchema,
  UserUpdateSchema,
} from "../validation";

export const userRoutes = new Elysia({ prefix: "/users" })
  .use(jwt({ name: "jwt", secret: JWT_SECRET }))
  .derive(async ({ jwt, headers }) => {
    const authorization = headers.authorization;
    if (authorization?.startsWith("Bearer ")) {
      const token = authorization.slice(7);
      const profile = await jwt.verify(token);
      if (profile) return { user: profile as AuthUser };
    }
    return { user: null as AuthUser | null };
  })
  .post(
    "/login",
    async ({ body, jwt, set }) => {
      const { email, password } = body;
      const records = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      const user = records[0];
      if (!user || user.password !== password) {
        set.status = 401;
        return { message: "Invalid credentials" };
      }
      const token = await jwt.sign({ id: user.id, email: user.email });
      return {
        token,
        user: { id: user.id, name: user.name, email: user.email },
      };
    },
    {
      body: UserLoginSchema,
      detail: {
        summary: "Login",
        description:
          "Authenticate with email and password. Returns a JWT token for use in subsequent requests.",
        tags: ["Auth"],
      },
    },
  )
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const { name, email, password } = body;
        const result = await db
          .insert(users)
          .values({ name, email, password })
          .returning({ id: users.id });
        set.status = 201;
        return { id: result[0].id, name, email };
      } catch (e: any) {
        if (e.code === "23505") {
          set.status = 409;
          return { message: "Email already exists" };
        }
        set.status = 400;
        return { message: "Failed to create user", error: e.message };
      }
    },
    {
      body: UserRegistrationSchema,
      detail: {
        summary: "Register new user",
        description:
          "Create a new user account with name, email, and password. Email must be unique.",
        tags: ["Auth"],
      },
    },
  )
  .get(
    "/",
    async () => {
      return db
        .select({ id: users.id, name: users.name, email: users.email })
        .from(users);
    },
    {
      detail: {
        summary: "List all users",
        description:
          "Returns a list of all registered users (id, name, email). Does not include passwords.",
        tags: ["Users"],
      },
    },
  )
  .get(
    "/:id",
    async ({ params, set }) => {
      const records = await db
        .select({ id: users.id, name: users.name, email: users.email })
        .from(users)
        .where(eq(users.id, Number(params.id)))
        .limit(1);
      if (!records[0]) {
        set.status = 404;
        return { message: "User not found" };
      }
      return records[0];
    },
    {
      detail: {
        summary: "Get user by ID",
        description:
          "Returns a single user by their ID. Returns 404 if the user does not exist.",
        tags: ["Users"],
      },
    },
  )
  .put(
    "/:id",
    async ({ params, body, set }) => {
      try {
        const { name, email, password } = body;
        const updateData: Record<string, string> = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (password) updateData.password = password;
        if (Object.keys(updateData).length === 0)
          return { message: "No fields to update" };
        await db
          .update(users)
          .set(updateData)
          .where(eq(users.id, Number(params.id)));
        return { message: "User updated" };
      } catch (e: any) {
        set.status = 400;
        return { message: "Failed to update user", error: e.message };
      }
    },
    {
      body: UserUpdateSchema,
      detail: {
        summary: "Update user",
        description:
          "Update a user's name, email, or password. Only provided fields are updated.",
        tags: ["Users"],
      },
    },
  )
  .delete(
    "/:id",
    async ({ params, set }) => {
      const result = await db
        .delete(users)
        .where(eq(users.id, Number(params.id)))
        .returning({ deletedId: users.id });
      if (result.length === 0) {
        set.status = 404;
        return { message: "User not found" };
      }
      return { message: "User deleted" };
    },
    {
      detail: {
        summary: "Delete user",
        description:
          "Permanently delete a user by their ID. Also cascades to delete all their tasks. Returns 404 if the user does not exist.",
        tags: ["Users"],
      },
    },
  )
  .get(
    "/:id/tasks",
    async ({ params }) => {
      return db
        .select()
        .from(tasks)
        .where(eq(tasks.userId, Number(params.id)));
    },
    {
      detail: {
        summary: "Get tasks by user ID",
        description: "Returns all tasks belonging to a specific user.",
        tags: ["Users"],
      },
    },
  );
