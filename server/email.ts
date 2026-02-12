import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM || "Horizonte Cafe <onboarding@resend.dev>";

if (!RESEND_API_KEY) {
  console.warn("[EMAIL] RESEND_API_KEY not set. Email sending disabled.");
}

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.warn("[EMAIL] Skipping (no API key):", payload.subject, "->", payload.to);
    return { success: false, error: "Email service not configured" };
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });
    console.log("[EMAIL] Sent:", payload.subject, "->", payload.to);
    return { success: true };
  } catch (error: any) {
    console.error("[EMAIL] Failed:", payload.subject, error?.message || error);
    return { success: false, error: error?.message || "Unknown error" };
  }
}

export function sendEmailAsync(payload: EmailPayload): void {
  sendEmail(payload).catch((err) => {
    console.error("[EMAIL] Fire-and-forget error:", err);
  });
}
