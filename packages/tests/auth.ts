import fs from "fs";
import path from "path";

function getAuthToken(): string {
  const authPath = path.resolve(process.cwd(), "auth.json");
  const { accessToken } = JSON.parse(fs.readFileSync(authPath, "utf-8"));
  return accessToken;
}

export function authHeader(): Record<string, string> {
  return { Authorization: `Bearer ${getAuthToken()}` };
}
