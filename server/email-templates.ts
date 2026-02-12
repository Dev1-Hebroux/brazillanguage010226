const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

function esc(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function getEmailLayout(content: string, unsubscribeUrl?: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
body{font-family:system-ui,-apple-system,sans-serif;background:#f9fafb;margin:0;padding:20px;color:#1f2937}
.c{max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,.07)}
.hd{background:linear-gradient(135deg,#1e40af,#2563eb);padding:28px 30px;text-align:center}
.hd h1{color:#fff;margin:0;font-size:20px;font-weight:700;letter-spacing:-.3px}
.hd p{color:rgba(255,255,255,.75);margin:6px 0 0;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600}
.bd{padding:32px 30px}
.bd h2{color:#1e40af;margin:0 0 16px;font-size:22px}
.bd p{line-height:1.7;margin:0 0 14px;color:#374151}
.btn{display:inline-block;background:#2563eb;color:#fff!important;text-decoration:none;padding:14px 32px;border-radius:50px;font-weight:700;font-size:15px;margin:8px 0}
.btn-green{background:#10b981}
.card{background:#f0f9ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px;margin:18px 0}
.card-green{background:#ecfdf5;border-color:#a7f3d0}
.card-yellow{background:#fffbeb;border-color:#fde68a}
.ft{background:#f9fafb;padding:24px 30px;text-align:center;font-size:12px;color:#9ca3af;border-top:1px solid #f3f4f6}
.ft a{color:#2563eb;text-decoration:none}
.label{font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:700;color:#6b7280;margin:0 0 6px}
.value{font-size:16px;font-weight:600;color:#1f2937;margin:0 0 12px}
</style>
</head>
<body>
<div class="c">
<div class="hd">
<h1>Horizonte Cafe</h1>
<p>English for Impact</p>
</div>
<div class="bd">
${content}
</div>
<div class="ft">
<p>Horizonte Cafe &mdash; Building confident English speakers in Brasilia</p>
<p>An initiative of RCCG, Hallelujah House of Praise</p>
${unsubscribeUrl ? `<p style="margin-top:12px"><a href="${esc(unsubscribeUrl)}">Unsubscribe from these emails</a></p>` : ""}
</div>
</div>
</body>
</html>`;
}

// ─── Track name helper ──────────────────────────────────────

const TRACK_TITLES: Record<string, string> = {
  "a1-beginner": "A1 Cohort (Beginner)",
  "a2-elementary": "A2 Cohort (Elementary)",
  "intermediate": "Intermediate Cohort",
  "advanced": "Advanced Cohort",
};

export function getTrackTitle(trackId: string): string {
  return TRACK_TITLES[trackId] || trackId;
}

// ─── Transactional Templates ────────────────────────────────

export function cohortApplicationConfirmation(data: {
  fullName: string;
  trackId: string;
  applicationId: number;
}): { subject: string; html: string } {
  const trackTitle = getTrackTitle(data.trackId);
  const unsub = `${BASE_URL}/unsubscribe/application/${data.applicationId}`;

  const content = `
<h2>Hi ${esc(data.fullName)}!</h2>
<p>We received your application for <strong>${esc(trackTitle)}</strong>. Thank you for taking this step!</p>
<div class="card">
<p class="label">What happens next?</p>
<p>Our team will review your application within <strong>48 hours</strong>. You'll receive an email when a decision is made.</p>
</div>
<p>In the meantime, feel free to explore our free resources or reach out with any questions.</p>
<p style="text-align:center">
<a href="${BASE_URL}/resources" class="btn">Explore Resources</a>
</p>
<p style="color:#6b7280;font-size:14px">Questions? Reply to this email or message us on WhatsApp.</p>`;

  return {
    subject: "Your Horizonte Cafe Application - Received!",
    html: getEmailLayout(content, unsub),
  };
}

export function eventRsvpConfirmation(data: {
  fullName: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  rsvpId: number;
}): { subject: string; html: string } {
  const unsub = `${BASE_URL}/unsubscribe/rsvp/${data.rsvpId}`;

  const content = `
<h2>You're registered, ${esc(data.fullName)}!</h2>
<p>Your spot for <strong>${esc(data.eventTitle)}</strong> is confirmed.</p>
<div class="card-green card">
<p class="label">Event Details</p>
<p class="value">${esc(data.eventDate)}</p>
<p class="label">Time</p>
<p class="value">${esc(data.eventTime)}</p>
<p class="label">Location</p>
<p class="value">${esc(data.eventLocation)}</p>
</div>
<div class="card-yellow card">
<p><strong>What to bring:</strong> Just yourself and a smile! Coffee is on us.</p>
<p><strong>Tip:</strong> Look for the "Horizonte" sign when you arrive.</p>
</div>
<p style="color:#6b7280;font-size:14px">Can't make it? No worries &mdash; just let us know so we can free up your spot.</p>`;

  return {
    subject: `You're Registered - ${data.eventTitle}`,
    html: getEmailLayout(content, unsub),
  };
}

export function contactAutoReply(data: {
  name: string;
}): { subject: string; html: string } {
  const content = `
<h2>Hi ${esc(data.name)}!</h2>
<p>Thanks for reaching out to Horizonte Cafe. We received your message and will get back to you within <strong>48 hours</strong>.</p>
<p>If your question is urgent, you can also reach us on WhatsApp for a faster response.</p>
<p style="text-align:center">
<a href="${BASE_URL}/faq" class="btn">Check Our FAQ</a>
</p>`;

  return {
    subject: "We Got Your Message - Horizonte Cafe",
    html: getEmailLayout(content),
  };
}

// ─── Admin-Triggered Templates ──────────────────────────────

export function applicationApproved(data: {
  fullName: string;
  trackId: string;
  applicationId: number;
}): { subject: string; html: string } {
  const trackTitle = getTrackTitle(data.trackId);
  const unsub = `${BASE_URL}/unsubscribe/application/${data.applicationId}`;

  const content = `
<h2>Congratulations, ${esc(data.fullName)}!</h2>
<p>Your application to <strong>${esc(trackTitle)}</strong> has been <span style="color:#10b981;font-weight:700">approved</span>!</p>
<div class="card-green card">
<p class="label">Your Cohort</p>
<p class="value">${esc(trackTitle)}</p>
<p class="label">Duration</p>
<p class="value">8 Weeks</p>
<p class="label">Format</p>
<p class="value">Weekly sessions + daily practice</p>
</div>
<p><strong>What's next?</strong></p>
<ul style="line-height:2">
<li>You'll receive preparation tips in the coming days</li>
<li>Join our WhatsApp group for your cohort</li>
<li>Check out the resources page to get a head start</li>
</ul>
<p style="text-align:center">
<a href="${BASE_URL}/dashboard/${esc(data.trackId)}" class="btn btn-green">Go to Your Dashboard</a>
</p>`;

  return {
    subject: "Congratulations - You're In!",
    html: getEmailLayout(content, unsub),
  };
}

export function applicationRejected(data: {
  fullName: string;
  trackId: string;
  applicationId: number;
}): { subject: string; html: string } {
  const trackTitle = getTrackTitle(data.trackId);
  const unsub = `${BASE_URL}/unsubscribe/application/${data.applicationId}`;

  const content = `
<h2>Hi ${esc(data.fullName)},</h2>
<p>Thank you for your interest in <strong>${esc(trackTitle)}</strong>. Unfortunately, we're unable to offer you a spot in this cohort at this time.</p>
<p>This doesn't mean the end of your journey! Here's what you can do:</p>
<div class="card">
<ul style="line-height:2;margin:0">
<li><strong>Try a different level</strong> &mdash; our placement quiz can help find the right fit</li>
<li><strong>Join our English Cafe events</strong> &mdash; free, relaxed practice sessions</li>
<li><strong>Apply again</strong> for the next cohort cycle</li>
</ul>
</div>
<p style="text-align:center">
<a href="${BASE_URL}/resources" class="btn">Take Placement Quiz</a>
</p>
<p style="color:#6b7280;font-size:14px">We're rooting for you. Keep learning!</p>`;

  return {
    subject: "About Your Application - Horizonte Cafe",
    html: getEmailLayout(content, unsub),
  };
}

// ─── Drip Sequence Templates ────────────────────────────────

export function welcomeDripDay0(data: {
  fullName: string;
  trackId: string;
  applicationId: number;
}): { subject: string; html: string } {
  const trackTitle = getTrackTitle(data.trackId);
  const unsub = `${BASE_URL}/unsubscribe/application/${data.applicationId}`;

  const content = `
<h2>Welcome to ${esc(trackTitle)}, ${esc(data.fullName)}!</h2>
<p>We're so excited to have you on board. Here's a quick orientation to help you get started:</p>
<div class="card">
<p><strong>How it works:</strong></p>
<ul style="line-height:2;margin:0">
<li>8 weeks of structured English learning</li>
<li>Weekly live sessions with your cohort group</li>
<li>Daily practice prompts (Mon-Thu)</li>
<li>WhatsApp group for support and community</li>
</ul>
</div>
<div class="card-yellow card">
<p><strong>Your commitment:</strong> Attend weekly sessions, complete daily prompts, and stay active in the group. Consistency is the key to progress!</p>
</div>
<p style="text-align:center">
<a href="${BASE_URL}/dashboard/${esc(data.trackId)}" class="btn">View Your Dashboard</a>
</p>`;

  return {
    subject: `Welcome to ${trackTitle} - Let's Get Started!`,
    html: getEmailLayout(content, unsub),
  };
}

export function welcomeDripDay2(data: {
  fullName: string;
  trackId: string;
  applicationId: number;
}): { subject: string; html: string } {
  const trackTitle = getTrackTitle(data.trackId);
  const unsub = `${BASE_URL}/unsubscribe/application/${data.applicationId}`;

  const content = `
<h2>Getting Ready, ${esc(data.fullName)}!</h2>
<p>Your ${esc(trackTitle)} starts soon. Here are some tips to prepare:</p>
<div class="card-green card">
<p><strong>Before you start:</strong></p>
<ul style="line-height:2;margin:0">
<li>Find a quiet spot where you can practice speaking</li>
<li>Download WhatsApp if you haven't already</li>
<li>Try our free taster lessons to warm up</li>
<li>Set a daily reminder for practice time</li>
</ul>
</div>
<p style="text-align:center">
<a href="${BASE_URL}/tasters" class="btn">Try Free Tasters</a>
</p>
<p style="text-align:center">
<a href="${BASE_URL}/resources" class="btn" style="background:#6b7280">Browse Resources</a>
</p>`;

  return {
    subject: "Getting Ready - Resources & Tips",
    html: getEmailLayout(content, unsub),
  };
}

export function welcomeDripDay6(data: {
  fullName: string;
  trackId: string;
  applicationId: number;
}): { subject: string; html: string } {
  const trackTitle = getTrackTitle(data.trackId);
  const unsub = `${BASE_URL}/unsubscribe/application/${data.applicationId}`;

  const content = `
<h2>Starting Tomorrow, ${esc(data.fullName)}!</h2>
<p>Your ${esc(trackTitle)} journey begins tomorrow. Here's your final checklist:</p>
<div class="card-yellow card">
<p><strong>Quick checklist:</strong></p>
<ul style="line-height:2;margin:0">
<li>Join the WhatsApp group (check your earlier emails)</li>
<li>Block out time in your calendar for weekly sessions</li>
<li>Have a notebook ready for notes</li>
<li>Bring your curiosity and positive energy!</li>
</ul>
</div>
<p>Remember: everyone in your cohort is learning together. There's no judgment, only encouragement.</p>
<p style="text-align:center">
<a href="${BASE_URL}/dashboard/${esc(data.trackId)}" class="btn btn-green">Open Dashboard</a>
</p>
<p style="color:#6b7280;font-size:14px;text-align:center">See you tomorrow! The Horizonte Cafe Team</p>`;

  return {
    subject: "Starting Tomorrow - Final Reminders!",
    html: getEmailLayout(content, unsub),
  };
}

// ─── Event Reminder Template ────────────────────────────────

export function eventReminder24h(data: {
  fullName: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  rsvpId: number;
}): { subject: string; html: string } {
  const unsub = `${BASE_URL}/unsubscribe/rsvp/${data.rsvpId}`;

  const content = `
<h2>Tomorrow: ${esc(data.eventTitle)}</h2>
<p>Hi ${esc(data.fullName)}, just a friendly reminder that you're registered for tomorrow's event!</p>
<div class="card-green card">
<p class="label">When</p>
<p class="value">${esc(data.eventDate)} at ${esc(data.eventTime)}</p>
<p class="label">Where</p>
<p class="value">${esc(data.eventLocation)}</p>
</div>
<p>Coffee is on us. See you there!</p>`;

  return {
    subject: `Tomorrow - ${data.eventTitle} Reminder`,
    html: getEmailLayout(content, unsub),
  };
}

// ─── Newsletter Layout ──────────────────────────────────────

export function newsletterEmail(data: {
  body: string;
}): { html: string } {
  const content = `${data.body}`;
  return {
    html: getEmailLayout(content),
  };
}
