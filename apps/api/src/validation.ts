import { t } from "elysia";

export const UserRegistrationSchema = t.Object({
  name: t.String({ minLength: 1 }),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 6 }),
});

export const UserLoginSchema = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 1 }),
});

export const UserUpdateSchema = t.Object({
  name: t.Optional(t.String()),
  email: t.Optional(t.String({ format: "email" })),
  password: t.Optional(t.String({ minLength: 6 })),
});

export const TaskCreateSchema = t.Object({
  title: t.String({ minLength: 1 }),
  description: t.Optional(t.String()),
});

export const TaskUpdateSchema = t.Object({
  title: t.Optional(t.String()),
  description: t.Optional(t.String()),
  completed: t.Optional(t.Boolean()),
});
