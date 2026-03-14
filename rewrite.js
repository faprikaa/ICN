const fs = require('fs');
let content = fs.readFileSync('apps/api/src/index.ts', 'utf8');

// Replace .group("/users", (app) => app with const userRoutes = new Elysia({ prefix: "/users" }).use(setup)
content = content.replace(
  /\.group\("\/users", \(app\) =>\s+app/,
  '// --- Auth & Users Routes ---\nconst userRoutes = new Elysia({ prefix: "/users" })\n  .use(setup)'
);

// Replace .group("/tasks", (app) => app with const taskRoutes = new Elysia({ prefix: "/tasks" }).use(setup)
content = content.replace(
  /\.group\("\/tasks", \(app\) =>\s+app/,
  '// --- Tasks Routes ---\nconst taskRoutes = new Elysia({ prefix: "/tasks" })\n  .use(setup)'
);

// Fix the end of the groups
content = content.replace(
      /\)\s*\/\/\s*--- Tasks Routes ---/g,
      ';\n\n// --- Tasks Routes ---'
);

// We need to carefully split building the app. 
// What I will do instead is write a precise replacement string for the app definition.
