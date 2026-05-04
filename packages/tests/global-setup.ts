import { type FullConfig } from "@playwright/test";
import { execSync } from "child_process";
import path from "path";

async function globalSetup(config: FullConfig) {
  console.log("🔄 Preparing the test environment...");

  // Reset and seed the database
  execSync("bun run db:seed", {
    stdio: "inherit",
    cwd: path.resolve(__dirname, "../server"),
  });

  console.log("✅ Database ready for tests!");
}

export default globalSetup;
