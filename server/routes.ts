import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCohortApplicationSchema, insertEventRsvpSchema, insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import { adminRouter } from "./admin-routes";
import { sendEmailAsync } from "./email";
import { cohortApplicationConfirmation, eventRsvpConfirmation, contactAutoReply } from "./email-templates";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Mount admin routes under /api/admin prefix
  app.use("/api/admin", adminRouter);

  app.post("/api/cohort-applications", async (req, res) => {
    try {
      const data = insertCohortApplicationSchema.parse(req.body);

      const existing = await storage.getCohortApplicationByEmail(data.email, data.trackId);
      if (existing) {
        return res.status(409).json({ message: "You have already applied for this track." });
      }

      const application = await storage.createCohortApplication(data);

      // Fire-and-forget confirmation email
      const email = cohortApplicationConfirmation({
        fullName: application.fullName,
        trackId: application.trackId,
        applicationId: application.id,
      });
      sendEmailAsync({ to: application.email, subject: email.subject, html: email.html });

      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating cohort application:", error);
      res.status(500).json({ message: "Failed to submit application" });
    }
  });

  app.get("/api/cohort-applications", async (_req, res) => {
    try {
      const applications = await storage.getCohortApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.get("/api/events", async (_req, res) => {
    try {
      const eventsList = await storage.getEvents();
      res.json(eventsList);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      const rsvpCount = await storage.getEventRsvpCount(id);
      res.json({ ...event, rsvpCount });
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.post("/api/events/:id/rsvp", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      const data = insertEventRsvpSchema.parse({ ...req.body, eventId });

      const existing = await storage.getEventRsvpByEmail(eventId, data.email);
      if (existing) {
        return res.status(409).json({ message: "You have already RSVP'd for this event." });
      }

      const rsvpCount = await storage.getEventRsvpCount(eventId);
      if (event.maxSpots && rsvpCount >= event.maxSpots) {
        return res.status(409).json({ message: "This event is full." });
      }

      const rsvp = await storage.createEventRsvp(data);

      // Fire-and-forget RSVP confirmation email
      const email = eventRsvpConfirmation({
        fullName: rsvp.fullName,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        eventLocation: event.location,
        rsvpId: rsvp.id,
      });
      sendEmailAsync({ to: rsvp.email, subject: email.subject, html: email.html });

      res.status(201).json(rsvp);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating RSVP:", error);
      res.status(500).json({ message: "Failed to submit RSVP" });
    }
  });

  app.get("/api/events/:id/rsvps", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const rsvps = await storage.getEventRsvps(eventId);
      res.json(rsvps);
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
      res.status(500).json({ message: "Failed to fetch RSVPs" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(data);

      // Fire-and-forget auto-reply email
      const email = contactAutoReply({ name: message.name });
      sendEmailAsync({ to: message.email, subject: email.subject, html: email.html });

      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating contact message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  return httpServer;
}
