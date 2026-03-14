import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-12345";

export type AuthUser = { id: number; email: string };

// Call this function directly on a route chain — do NOT store as a const.
// Elysia requires .derive() to be inlined on the same chain for type inference to work.
export function withAuth() {
    return new Elysia()
        .use(jwt({ name: "jwt", secret: JWT_SECRET }))
        .derive(async ({ jwt, headers }): Promise<{ user: AuthUser | null }> => {
            const authorization = headers.authorization;
            if (authorization?.startsWith("Bearer ")) {
                const token = authorization.slice(7);
                const profile = await jwt.verify(token);
                if (profile) return { user: profile as AuthUser };
            }
            return { user: null };
        });
}

export { JWT_SECRET };