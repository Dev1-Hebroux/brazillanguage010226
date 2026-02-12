import { Router, Request, Response } from "express";
import { db } from "../db";
import { cohortApplications, eventRsvps } from "@shared/schema";
import { eq } from "drizzle-orm";

export const unsubscribeRouter = Router();

const CONFIRMATION_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Unsubscribed</title>
<style>
body{font-family:system-ui,-apple-system,sans-serif;background:#f9fafb;margin:0;padding:40px 20px;color:#1f2937;text-align:center}
.c{max-width:480px;margin:0 auto;background:#fff;border-radius:16px;padding:40px 30px;box-shadow:0 4px 6px rgba(0,0,0,.07)}
h1{color:#1e40af;margin:0 0 12px;font-size:24px}
p{line-height:1.7;color:#374151;margin:0 0 16px}
</style>
</head>
<body>
<div class="c">
<h1>You've been unsubscribed</h1>
<p>You will no longer receive emails from Horizonte Cafe for this subscription.</p>
<p style="color:#6b7280;font-size:14px">If this was a mistake, you can re-subscribe by submitting a new application or RSVP.</p>
</div>
</body>
</html>`;

unsubscribeRouter.get("/unsubscribe/application/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await db.update(cohortApplications).set({ emailOptIn: false }).where(eq(cohortApplications.id, id));
    res.type("html").send(CONFIRMATION_HTML);
  } catch (error) {
    console.error("Unsubscribe error:", error);
    res.type("html").send(CONFIRMATION_HTML);
  }
});

unsubscribeRouter.get("/unsubscribe/rsvp/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await db.update(eventRsvps).set({ emailOptIn: false }).where(eq(eventRsvps.id, id));
    res.type("html").send(CONFIRMATION_HTML);
  } catch (error) {
    console.error("Unsubscribe error:", error);
    res.type("html").send(CONFIRMATION_HTML);
  }
});
