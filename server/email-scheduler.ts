import { storage } from "./storage";
import { sendEmail } from "./email";

const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const BATCH_SIZE = 10;

async function processQueue(): Promise<void> {
  try {
    const pending = await storage.getPendingEmails(BATCH_SIZE);
    if (pending.length === 0) return;

    console.log(`[EMAIL-SCHEDULER] Processing ${pending.length} queued email(s)`);

    for (const item of pending) {
      const result = await sendEmail({ to: item.to, subject: item.subject, html: item.html });
      if (result.success) {
        await storage.markEmailSent(item.id);
      } else {
        await storage.markEmailFailed(item.id, result.error || "Unknown error");
      }
    }
  } catch (err) {
    console.error("[EMAIL-SCHEDULER] Error processing queue:", err);
  }
}

export function startEmailScheduler(): void {
  console.log("[EMAIL-SCHEDULER] Started (polling every 5 minutes)");
  // Process immediately on startup, then poll
  processQueue();
  setInterval(processQueue, POLL_INTERVAL_MS);
}
