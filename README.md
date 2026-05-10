# Employee Management System

A full-stack EMS application supporting admin and employee role authentication.

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

This project was created using `bun init` in bun v1.3.5. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
