import { request, type FullConfig } from "@playwright/test";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const BASE_URL = "http://localhost:3000";

async function globalSetup(config: FullConfig) {
  console.log("Preparing the test environment...");

  const context = await request.newContext();

  // Reset and seed the database
  execSync("bun run db:seed", {
    stdio: "inherit",
    cwd: path.resolve(__dirname, "../server"),
  });

  console.log("✅ Database ready for tests!");

  const res = await context.post(`${BASE_URL}/api/auth/signin`, {
    data: {
      email: "approver@test.com",
      password: "123456789@Aa",
    },
  });

  if (!res.ok()) {
    throw new Error(`Sign in failed: ${res.status()} ${await res.text()}`);
  }

  const body = await res.json();
  fs.writeFileSync(
    "auth.json",
    JSON.stringify({ accessToken: body.accessToken })
  );
  console.log("✅ Sign In successfully. Ready for tests");
}

export default globalSetup;
