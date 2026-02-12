import { Router, Request, Response } from "express";
import { storage } from "./storage";
import { requireRole } from "./auth";
import { insertEventSchema } from "@shared/schema";
import { z } from "zod";

export const adminRouter = Router();

// All admin routes require at least trainer role
adminRouter.use(requireRole("admin", "trainer"));

// ─── Applications ──────────────────────────────────────────────

adminRouter.get("/api/admin/applications", async (_req: Request, res: Response) => {
  try {
    const applications = await storage.getCohortApplications();
    res.json(applications);
  } catch (error) {
    console.error("Admin: Error fetching applications:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

adminRouter.patch("/api/admin/applications/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    if (!status || !["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const updated = await storage.updateCohortApplicationStatus(id, status);
    if (!updated) return res.status(404).json({ message: "Application not found" });
    res.json(updated);
  } catch (error) {
    console.error("Admin: Error updating application:", error);
    res.status(500).json({ message: "Failed to update application" });
  }
});

adminRouter.delete("/api/admin/applications/:id", async (req: Request, res: Response) => {
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

adminRouter.get("/api/admin/events", async (_req: Request, res: Response) => {
  try {
    const eventsList = await storage.getEvents();
    res.json(eventsList);
  } catch (error) {
    console.error("Admin: Error fetching events:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

adminRouter.post("/api/admin/events", async (req: Request, res: Response) => {
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

adminRouter.patch("/api/admin/events/:id", async (req: Request, res: Response) => {
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

adminRouter.delete("/api/admin/events/:id", async (req: Request, res: Response) => {
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

adminRouter.get("/api/admin/rsvps", async (_req: Request, res: Response) => {
  try {
    const rsvps = await storage.getAllEventRsvps();
    res.json(rsvps);
  } catch (error) {
    console.error("Admin: Error fetching RSVPs:", error);
    res.status(500).json({ message: "Failed to fetch RSVPs" });
  }
});

adminRouter.delete("/api/admin/rsvps/:id", async (req: Request, res: Response) => {
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

adminRouter.get("/api/admin/contacts", async (_req: Request, res: Response) => {
  try {
    const messages = await storage.getContactMessages();
    res.json(messages);
  } catch (error) {
    console.error("Admin: Error fetching contacts:", error);
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
});

adminRouter.delete("/api/admin/contacts/:id", async (req: Request, res: Response) => {
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

adminRouter.get("/api/admin/users", requireRole("admin"), async (_req: Request, res: Response) => {
  try {
    const usersList = await storage.getUsers();
    res.json(usersList.map(u => ({ id: u.id, username: u.username, role: u.role })));
  } catch (error) {
    console.error("Admin: Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

adminRouter.patch("/api/admin/users/:id/role", requireRole("admin"), async (req: Request, res: Response) => {
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
