# Task Manager Web

The frontend application for the Task Manager, built with **Next.js** and **React**.

**Live**: [https://icn.muammar.web.id](https://icn.muammar.web.id/)

## Features

- **Authentication** — Login and registration with JWT token management
- **Task Dashboard** — View, create, edit, and delete tasks
- **WYSIWYG Editing** — Rich text editor for task descriptions (full toolbar) and titles (bold/italic/underline)
- **Task Completion** — Toggle tasks as complete/incomplete with visual feedback
- **Responsive Layout** — Ant Design components with clean, modern styling

## Tech Stack

| Category       | Technology                                                       |
| -------------- | ---------------------------------------------------------------- |
| Framework      | [Next.js 16](https://nextjs.org/) (App Router)                   |
| UI Library     | [Ant Design 6](https://ant.design/)                              |
| Data Fetching  | [TanStack React Query 5](https://tanstack.com/query/latest)      |
| HTTP Client    | [Axios](https://axios-http.com/)                                 |
| WYSIWYG Editor | [React Quill New](https://www.npmjs.com/package/react-quill-new) |
| Language       | TypeScript                                                       |

## Project Structure

```
apps/web/
├── app/
│   ├── components/
│   │   ├── ErrorBoundary.tsx         # React error boundary with fallback UI
│   │   ├── RichTextEditor.tsx        # Full WYSIWYG editor (description)
│   │   ├── SimpleRichTextEditor.tsx  # Minimal editor (title: bold/italic/underline)
│   │   ├── TaskList.tsx              # Task list with pagination and completion toggle
│   │   └── TaskModal.tsx             # Create/edit task modal with WYSIWYG editors
│   ├── login/page.tsx                # Login page
│   ├── register/page.tsx             # Registration page
│   ├── page.tsx                      # Dashboard (main task manager)
│   ├── layout.tsx                    # Root layout with Ant Design + React Query providers
│   └── providers.tsx                 # React Query client provider
├── hooks/
│   ├── useAuth.ts                    # Authentication state hook (token + user)
│   └── mutations/
│       ├── useAuthMutations.ts       # Login/register mutations
│       └── useTaskMutations.ts       # Create/update/delete task mutations
├── lib/
│   ├── api.ts                        # Axios instance with JWT interceptor
│   └── sanitize.ts                   # DOMPurify HTML sanitization wrapper
├── types/
│   └── index.ts                      # TypeScript interfaces (Task, User, etc.)
└── package.json
```

## Getting Started

### Environment Variables

```bash
cp .env.example .env
```

| Variable              | Description          | Default                 |
| --------------------- | -------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001` |

### Development

```bash
# from apps/web directory
bun run dev

# or from the monorepo root
bun run dev --filter=web
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building

```bash
bun run build
```

### Linting & Type Checking

```bash
bun run lint
bun run check-types
```
