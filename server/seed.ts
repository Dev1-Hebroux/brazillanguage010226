import bcrypt from "bcrypt";
import { storage } from "./storage";
import { db } from "../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

const SEED_ACCOUNTS = [
  { username: "admin", password: "Admin123!", role: "admin" },
  { username: "trainer", password: "Trainer123!", role: "trainer" },
];

export async function seedAccounts() {
  for (const account of SEED_ACCOUNTS) {
    const existing = await storage.getUserByUsername(account.username);
    if (existing) {
      // Ensure the role is correct even if account already exists
      if (existing.role !== account.role) {
        await storage.updateUserRole(existing.id, account.role);
        console.log(`[seed] Updated ${account.username} role to ${account.role}`);
      }
      continue;
    }

    const hashedPassword = await bcrypt.hash(account.password, 10);
    const user = await storage.createUser({ username: account.username, password: hashedPassword });
    // Set role after creation (since createUser uses insertUserSchema which doesn't include role)
    await db.update(users).set({ role: account.role }).where(eq(users.id, user.id));
    console.log(`[seed] Created ${account.role} account: ${account.username}`);
  }
}
