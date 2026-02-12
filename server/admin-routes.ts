import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { requireRole } from "./auth";
import { insertEventSchema } from "@shared/schema";
import { z } from "zod";
import { sendEmailAsync } from "./email";
import { applicationApproved, applicationRejected, welcomeDripDay0, welcomeDripDay2, welcomeDripDay6, newsletterEmail } from "./email-templates";

export const adminRouter = Router();

// All admin routes require at least trainer role
adminRouter.use(requireRole("admin", "trainer"));

// ─── Dashboard Stats ────────────────────────────────────────────

adminRouter.get("/stats", async (_req: Request, res: Response) => {
  try {
    const stats = await storage.getAdminStats();
    res.json(stats);
  } catch (error) {
    console.error("Admin: Error fetching stats:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// ─── Email Log ──────────────────────────────────────────────────

adminRouter.get("/email-log", async (_req: Request, res: Response) => {
  try {
    const log = await storage.getEmailLog(100);
    res.json(log);
  } catch (error) {
    console.error("Admin: Error fetching email log:", error);
    res.status(500).json({ message: "Failed to fetch email log" });
  }
});

// ─── Bulk Application Actions ───────────────────────────────────

adminRouter.post("/applications/bulk", async (req: Request, res: Response) => {
  try {
    const { ids, action } = req.body;
    if (!ids || !Array.isArray(ids) || !["approved", "rejected"].includes(action)) {
      return res.status(400).json({ message: "Invalid bulk action" });
    }
    const updated = await storage.bulkUpdateApplicationStatus(ids, action);
    res.json({ message: `${updated} application(s) updated to ${action}` });
  } catch (error) {
    console.error("Admin: Error in bulk action:", error);
    res.status(500).json({ message: "Failed to perform bulk action" });
  }
});

// ─── Application Export ─────────────────────────────────────────

adminRouter.get("/applications/export", async (_req: Request, res: Response) => {
  try {
    const apps = await storage.getCohortApplications();
    const header = "ID,Full Name,Email,Phone,Track,English Level,Status,Date\n";
    const rows = apps.map(a =>
      `${a.id},"${(a.fullName || "").replace(/"/g, '""')}","${a.email}","${a.phone || ""}","${a.trackId}","${a.englishLevel}","${a.status}","${a.createdAt ? new Date(a.createdAt).toISOString() : ""}"`
    ).join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=applications.csv");
    res.send(header + rows);
  } catch (error) {
    console.error("Admin: Error exporting applications:", error);
    res.status(500).json({ message: "Failed to export" });
  }
});

// ─── Event RSVP Export ──────────────────────────────────────────

adminRouter.get("/events/:id/export", async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id);
    const rsvps = await storage.getEventRsvps(eventId);
    const header = "ID,Full Name,Email,Phone,Date\n";
    const rows = rsvps.map(r =>
      `${r.id},"${(r.fullName || "").replace(/"/g, '""')}","${r.email}","${r.phone || ""}","${r.createdAt ? new Date(r.createdAt).toISOString() : ""}"`
    ).join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=rsvps-event-${eventId}.csv`);
    res.send(header + rows);
  } catch (error) {
    console.error("Admin: Error exporting RSVPs:", error);
    res.status(500).json({ message: "Failed to export RSVPs" });
  }
});

// ─── Contact Message Read Status ────────────────────────────────

adminRouter.patch("/contacts/:id/read", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await storage.markContactMessageRead(id);
    res.json({ message: "Marked as read" });
  } catch (error) {
    console.error("Admin: Error marking message read:", error);
    res.status(500).json({ message: "Failed to mark as read" });
  }
});

// ─── Create User (admin only) ───────────────────────────────────

adminRouter.post("/users/create", requireRole("admin"), async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    const existing = await storage.getUserByUsername(username);
    if (existing) {
      return res.status(409).json({ message: "Username already taken" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await storage.createUser({ username, password: hashedPassword });
    if (role && ["student", "trainer", "admin"].includes(role)) {
      await storage.updateUserRole(user.id, role);
    }
    res.status(201).json({ id: user.id, username: user.username, role: role || user.role });
  } catch (error) {
    console.error("Admin: Error creating user:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
});

// ─── Google Forms ───────────────────────────────────────────────

adminRouter.get("/google-forms", async (_req: Request, res: Response) => {
  try {
    const forms = await storage.getGoogleFormLinks();
    res.json(forms);
  } catch (error) {
    console.error("Admin: Error fetching google forms:", error);
    res.status(500).json({ message: "Failed to fetch google forms" });
  }
});

adminRouter.post("/google-forms", async (req: Request, res: Response) => {
  try {
    const { title, formUrl, sheetCsvUrl, linkedTo, linkedId } = req.body;
    if (!title || !formUrl) {
      return res.status(400).json({ message: "Title and form URL are required" });
    }
    const form = await storage.createGoogleFormLink({ title, formUrl, sheetCsvUrl, linkedTo: linkedTo || "general", linkedId });
    res.status(201).json(form);
  } catch (error) {
    console.error("Admin: Error creating google form link:", error);
    res.status(500).json({ message: "Failed to create google form link" });
  }
});

adminRouter.delete("/google-forms/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteGoogleFormLink(id);
    if (!deleted) return res.status(404).json({ message: "Form link not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Admin: Error deleting google form link:", error);
    res.status(500).json({ message: "Failed to delete" });
  }
});

// ─── Applications ──────────────────────────────────────────────

adminRouter.get("/applications", async (_req: Request, res: Response) => {
  try {
    const applications = await storage.getCohortApplications();
    res.json(applications);
  } catch (error) {
    console.error("Admin: Error fetching applications:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

adminRouter.patch("/applications/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { status, sendEmail: shouldSendEmail = true } = req.body;
    if (!status || !["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const updated = await storage.updateCohortApplicationStatus(id, status);
    if (!updated) return res.status(404).json({ message: "Application not found" });

    // Send notification email if toggled on
    if (shouldSendEmail && (status === "approved" || status === "rejected")) {
      const templateData = {
        fullName: updated.fullName,
        trackId: updated.trackId,
        applicationId: updated.id,
      };
      const email = status === "approved"
        ? applicationApproved(templateData)
        : applicationRejected(templateData);
      sendEmailAsync({ to: updated.email, subject: email.subject, html: email.html });

      // Queue welcome drip sequence on approval
      if (status === "approved") {
        const now = new Date();
        const drips = [
          { delay: 0, template: welcomeDripDay0 },
          { delay: 2, template: welcomeDripDay2 },
          { delay: 6, template: welcomeDripDay6 },
        ];
        for (const drip of drips) {
          const scheduled = new Date(now.getTime() + drip.delay * 24 * 60 * 60 * 1000);
          const dripEmail = drip.template(templateData);
          storage.enqueueEmail({
            to: updated.email,
            subject: dripEmail.subject,
            html: dripEmail.html,
            scheduledFor: scheduled,
            triggerType: "welcome-drip",
            triggerRefId: updated.id,
          }).catch(err => console.error("[DRIP] Failed to queue:", err));
        }
      }
    }

    res.json(updated);
  } catch (error) {
    console.error("Admin: Error updating application:", error);
    res.status(500).json({ message: "Failed to update application" });
  }
});

adminRouter.delete("/applications/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteCohortApplication(id);
    if (!deleted) return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Admin: Error deleting application:", error);
    res.status(500).json({ message: "Failed to delete application" });
  }
});

// ─── Events ────────────────────────────────────────────────────

adminRouter.get("/events", async (_req: Request, res: Response) => {
  try {
    const eventsList = await storage.getEvents();
    res.json(eventsList);
  } catch (error) {
    console.error("Admin: Error fetching events:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

adminRouter.post("/events", async (req: Request, res: Response) => {
  try {
    const data = insertEventSchema.parse(req.body);
    const event = await storage.createEvent(data);
    res.status(201).json(event);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid data", errors: error.errors });
    }
    console.error("Admin: Error creating event:", error);
    res.status(500).json({ message: "Failed to create event" });
  }
});

adminRouter.patch("/events/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updated = await storage.updateEvent(id, req.body);
    if (!updated) return res.status(404).json({ message: "Event not found" });
    res.json(updated);
  } catch (error) {
    console.error("Admin: Error updating event:", error);
    res.status(500).json({ message: "Failed to update event" });
  }
});

adminRouter.delete("/events/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteEvent(id);
    if (!deleted) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Admin: Error deleting event:", error);
    res.status(500).json({ message: "Failed to delete event" });
  }
});

// ─── RSVPs ─────────────────────────────────────────────────────

adminRouter.get("/rsvps", async (_req: Request, res: Response) => {
  try {
    const rsvps = await storage.getAllEventRsvps();
    res.json(rsvps);
  } catch (error) {
    console.error("Admin: Error fetching RSVPs:", error);
    res.status(500).json({ message: "Failed to fetch RSVPs" });
  }
});

adminRouter.delete("/rsvps/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteEventRsvp(id);
    if (!deleted) return res.status(404).json({ message: "RSVP not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Admin: Error deleting RSVP:", error);
    res.status(500).json({ message: "Failed to delete RSVP" });
  }
});

// ─── Contact Messages ──────────────────────────────────────────

adminRouter.get("/contacts", async (_req: Request, res: Response) => {
  try {
    const messages = await storage.getContactMessages();
    res.json(messages);
  } catch (error) {
    console.error("Admin: Error fetching contacts:", error);
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
});

adminRouter.delete("/contacts/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteContactMessage(id);
    if (!deleted) return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Admin: Error deleting contact:", error);
    res.status(500).json({ message: "Failed to delete contact" });
  }
});

// ─── Users (admin only) ────────────────────────────────────────

adminRouter.get("/users", requireRole("admin"), async (_req: Request, res: Response) => {
  try {
    const usersList = await storage.getUsers();
    res.json(usersList.map(u => ({ id: u.id, username: u.username, role: u.role })));
  } catch (error) {
    console.error("Admin: Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

adminRouter.patch("/users/:id/role", requireRole("admin"), async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    if (!role || !["student", "trainer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const updated = await storage.updateUserRole(req.params.id, role);
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json({ id: updated.id, username: updated.username, role: updated.role });
  } catch (error) {
    console.error("Admin: Error updating user role:", error);
    res.status(500).json({ message: "Failed to update user role" });
  }
});

// ─── Email Campaigns (admin only) ─────────────────────────────

adminRouter.get("/campaigns", requireRole("admin"), async (_req: Request, res: Response) => {
  try {
    const campaigns = await storage.getCampaigns();
    res.json(campaigns);
  } catch (error) {
    console.error("Admin: Error fetching campaigns:", error);
    res.status(500).json({ message: "Failed to fetch campaigns" });
  }
});

adminRouter.post("/campaigns", requireRole("admin"), async (req: Request, res: Response) => {
  try {
    const { subject, body, audience } = req.body;
    if (!subject || !body) {
      return res.status(400).json({ message: "Subject and body are required" });
    }
    const userId = (req as any).user?.id;
    const campaign = await storage.createCampaign({ subject, body, audience: audience || "all", createdBy: userId });
    res.status(201).json(campaign);
  } catch (error) {
    console.error("Admin: Error creating campaign:", error);
    res.status(500).json({ message: "Failed to create campaign" });
  }
});

adminRouter.post("/campaigns/:id/send", requireRole("admin"), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const campaign = await storage.getCampaign(id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    if (campaign.status === "sent") return res.status(400).json({ message: "Campaign already sent" });

    // Collect audience emails
    const emails = new Set<string>();
    const audience = campaign.audience;

    if (audience === "all" || audience === "approved" || audience.startsWith("track:")) {
      const apps = await storage.getCohortApplications();
      for (const app of apps) {
        if (audience === "all") emails.add(app.email);
        else if (audience === "approved" && app.status === "approved") emails.add(app.email);
        else if (audience.startsWith("track:") && app.trackId === audience.replace("track:", "")) emails.add(app.email);
      }
    }

    if (audience === "all" || audience === "events") {
      const rsvps = await storage.getAllEventRsvps();
      for (const rsvp of rsvps) {
        emails.add(rsvp.email);
      }
    }

    if (audience === "all") {
      const contacts = await storage.getContactMessages();
      for (const c of contacts) {
        emails.add(c.email);
      }
    }

    // Queue all emails
    const { html } = newsletterEmail({ body: campaign.body });
    const now = new Date();
    let queued = 0;
    for (const email of Array.from(emails)) {
      await storage.enqueueEmail({
        to: email,
        subject: campaign.subject,
        html,
        scheduledFor: now,
        triggerType: "campaign",
        triggerRefId: campaign.id,
      });
      queued++;
    }

    await storage.updateCampaignStatus(id, "sent", queued);
    res.json({ message: `Campaign queued for ${queued} recipient(s)` });
  } catch (error) {
    console.error("Admin: Error sending campaign:", error);
    res.status(500).json({ message: "Failed to send campaign" });
  }
});
