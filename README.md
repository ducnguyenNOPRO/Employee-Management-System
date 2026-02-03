# Employee Management System

A full-stack EMS application supporting admin and employee role authentication.

## In Progress

1. Finish JWT Authentication
2. Admin with 4 pages: Dashboard, Employees, Department, Leave Request (only FE)
3. Haven't touched role-based authentication yet

## Installation

**Required:**
- Bun runtime
- PostgreSQL database

### Steps

1. Clone the repository:
```bash
git clone https://github.com/ducnguyenNOPRO/Employee-Management-System.git
```

2. Install dependencies at root, `packages/client`, and `packages/server`:
```bash
bun install
```

## Usage

### Run both Frontend and Backend

At root:
```bash
bun run dev
```

### Run Frontend and Backend separately

At `packages/client` or `packages/server`:
```bash
bun run dev
```

### Run Prisma Studio for database observation
```bash
bunx prisma studio
```

## API Routes

| Category |      Endpoint       |  Method  |     Description      |
|----------|---------------------|----------|----------------------|
| **Auth** | `/api/auth/signin`  |   POST   | Sign in              |
| **Auth** | `/api/auth/signout` |   POST   | Sign out             |
| **Auth** | `/api/auth/signup`  |   POST   | Sign up              |
| **Auth** | `/api/auth/refresh` |   POST   | Refresh access token |
| **User** | `/api/users/me`     |   GET    | Get current user     |

---

This project was created using `bun init` in bun v1.3.5. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
