import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "./auth";
import { storage } from "./storage";
import {
  registerUserSchema,
  loginSchema,
  insertPlacementResponseSchema,
  insertContactMessageSchema,
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";

// Middleware to check if user is authenticated
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// Middleware to check if user is admin
function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && req.user?.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Forbidden" });
}

// Helper to exclude password from user response
function sanitizeUser(user: any) {
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session configuration
  const MemoryStoreSession = MemoryStore(session);

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "horizonte-cafe-secret-key-2024",
      resave: false,
      saveUninitialized: false,
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // ==================== AUTH ROUTES ====================

  // Register
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const result = registerUserSchema.safeParse(req.body);
      if (!result.success) {
        const error = fromZodError(result.error);
        return res.status(400).json({ message: error.message });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(result.data.email);
      if (existingUser) {
        return res.status(409).json({ message: "Email already registered" });
      }

      // Create user
      const user = await storage.createUser(result.data);

      // Log in the user automatically
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Registration successful but login failed" });
        }
        res.status(201).json({ user: sanitizeUser(user) });
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Registration failed" });
    }
  });

  // Login
  app.post("/api/auth/login", (req: Request, res: Response, next: NextFunction) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      const error = fromZodError(result.error);
      return res.status(400).json({ message: error.message });
    }

    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Authentication error" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed" });
        }
        res.json({ user: sanitizeUser(user) });
      });
    })(req, res, next);
  });

  // Logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/auth/me", (req: Request, res: Response) => {
    if (req.isAuthenticated() && req.user) {
      res.json({ user: sanitizeUser(req.user) });
    } else {
      res.status(401).json({ user: null });
    }
  });

  // ==================== USER ROUTES ====================

  // Update user profile
  app.patch("/api/users/me", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { name, phone, preferredLanguage } = req.body;
      const updates: any = {};
      if (name) updates.name = name;
      if (phone !== undefined) updates.phone = phone;
      if (preferredLanguage) updates.preferredLanguage = preferredLanguage;

      const user = await storage.updateUser(req.user!.id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user: sanitizeUser(user) });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Update failed" });
    }
  });

  // ==================== COHORT ROUTES ====================

  // Get all active cohorts
  app.get("/api/cohorts", async (req: Request, res: Response) => {
    try {
      const track = req.query.track as string | undefined;
      const cohorts = track
        ? await storage.getCohortsByTrack(track)
        : await storage.getActiveCohorts();
      res.json({ cohorts });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch cohorts" });
    }
  });

  // Get cohort by ID
  app.get("/api/cohorts/:id", async (req: Request, res: Response) => {
    try {
      const cohort = await storage.getCohort(req.params.id);
      if (!cohort) {
        return res.status(404).json({ message: "Cohort not found" });
      }
      res.json({ cohort });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch cohort" });
    }
  });

  // ==================== ENROLLMENT ROUTES ====================

  // Get user's enrollments
  app.get("/api/enrollments", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const enrollments = await storage.getUserEnrollments(req.user!.id);
      res.json({ enrollments });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch enrollments" });
    }
  });

  // Enroll in a cohort
  app.post("/api/enrollments", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { cohortId } = req.body;
      if (!cohortId) {
        return res.status(400).json({ message: "Cohort ID is required" });
      }

      // Check if cohort exists
      const cohort = await storage.getCohort(cohortId);
      if (!cohort) {
        return res.status(404).json({ message: "Cohort not found" });
      }

      // Check if already enrolled
      const existingEnrollment = await storage.getEnrollment(req.user!.id, cohortId);
      if (existingEnrollment) {
        return res.status(409).json({ message: "Already enrolled in this cohort" });
      }

      // Check capacity
      const enrollments = await storage.getCohortEnrollments(cohortId);
      if (cohort.maxStudents && enrollments.length >= cohort.maxStudents) {
        return res.status(400).json({ message: "Cohort is full" });
      }

      const enrollment = await storage.createEnrollment({
        userId: req.user!.id,
        cohortId,
        status: "active",
      });

      res.status(201).json({ enrollment, whatsappLink: cohort.whatsappLink });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Enrollment failed" });
    }
  });

  // ==================== LESSON ROUTES ====================

  // Get lessons
  app.get("/api/lessons", async (req: Request, res: Response) => {
    try {
      const { track, week } = req.query;
      let lessons;

      if (track && week) {
        lessons = await storage.getLessonsByWeek(track as string, parseInt(week as string));
      } else if (track) {
        lessons = await storage.getLessonsByTrack(track as string);
      } else {
        lessons = await storage.getLessons();
      }

      res.json({ lessons });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch lessons" });
    }
  });

  // Get lesson by ID
  app.get("/api/lessons/:id", async (req: Request, res: Response) => {
    try {
      const lesson = await storage.getLesson(req.params.id);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      res.json({ lesson });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch lesson" });
    }
  });

  // ==================== PROGRESS ROUTES ====================

  // Get user's progress
  app.get("/api/progress", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { cohortId } = req.query;
      const progress = cohortId
        ? await storage.getUserProgressByCohort(req.user!.id, cohortId as string)
        : await storage.getUserProgress(req.user!.id);
      res.json({ progress });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch progress" });
    }
  });

  // Update/create progress
  app.post("/api/progress", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { lessonId, cohortId, status, score } = req.body;

      if (!lessonId) {
        return res.status(400).json({ message: "Lesson ID is required" });
      }

      // Check if lesson exists
      const lesson = await storage.getLesson(lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      // Check if progress already exists
      let progress = await storage.getProgress(req.user!.id, lessonId);

      if (progress) {
        // Update existing progress
        progress = await storage.updateProgress(progress.id, {
          status: status || progress.status,
          score: score !== undefined ? score : progress.score,
          completedAt: status === "completed" ? new Date() : progress.completedAt,
        });
      } else {
        // Create new progress
        progress = await storage.createProgress({
          userId: req.user!.id,
          lessonId,
          cohortId: cohortId || null,
          status: status || "in_progress",
          score: score || null,
          completedAt: status === "completed" ? new Date() : null,
        });
      }

      res.json({ progress });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to update progress" });
    }
  });

  // ==================== EVENT ROUTES ====================

  // Get events
  app.get("/api/events", async (req: Request, res: Response) => {
    try {
      const { upcoming } = req.query;
      const events = upcoming === "true"
        ? await storage.getUpcomingEvents()
        : await storage.getActiveEvents();
      res.json({ events });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch events" });
    }
  });

  // Get event by ID
  app.get("/api/events/:id", async (req: Request, res: Response) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Get registration count
      const registrations = await storage.getEventRegistrations(event.id);

      res.json({
        event,
        registrationCount: registrations.length,
        spotsAvailable: event.maxAttendees ? event.maxAttendees - registrations.length : null
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch event" });
    }
  });

  // ==================== EVENT REGISTRATION ROUTES ====================

  // Get user's event registrations
  app.get("/api/event-registrations", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const registrations = await storage.getUserEventRegistrations(req.user!.id);
      res.json({ registrations });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch registrations" });
    }
  });

  // Register for an event
  app.post("/api/event-registrations", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { eventId } = req.body;
      if (!eventId) {
        return res.status(400).json({ message: "Event ID is required" });
      }

      // Check if event exists
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if already registered
      const existingRegistration = await storage.getEventRegistration(req.user!.id, eventId);
      if (existingRegistration) {
        return res.status(409).json({ message: "Already registered for this event" });
      }

      // Check capacity
      const registrations = await storage.getEventRegistrations(eventId);
      if (event.maxAttendees && registrations.length >= event.maxAttendees) {
        return res.status(400).json({ message: "Event is full" });
      }

      const registration = await storage.createEventRegistration({
        userId: req.user!.id,
        eventId,
        status: "registered",
      });

      res.status(201).json({ registration });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Registration failed" });
    }
  });

  // Cancel event registration
  app.delete("/api/event-registrations/:eventId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const registration = await storage.getEventRegistration(req.user!.id, req.params.eventId);
      if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
      }

      await storage.updateEventRegistration(registration.id, { status: "cancelled" });
      res.json({ message: "Registration cancelled" });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Cancellation failed" });
    }
  });

  // ==================== PLACEMENT QUIZ ROUTES ====================

  // Submit placement quiz
  app.post("/api/placement", async (req: Request, res: Response) => {
    try {
      const result = insertPlacementResponseSchema.safeParse(req.body);
      if (!result.success) {
        const error = fromZodError(result.error);
        return res.status(400).json({ message: error.message });
      }

      // Calculate recommendation based on score
      const score = result.data.score;
      let recommendedTrack: string;

      if (score <= 30) {
        recommendedTrack = "foundations";
      } else if (score <= 70) {
        recommendedTrack = "confidence";
      } else {
        recommendedTrack = "cafe";
      }

      const response = await storage.createPlacementResponse({
        ...result.data,
        recommendedTrack,
        userId: req.user?.id || null,
      });

      res.status(201).json({
        response,
        recommendation: {
          track: recommendedTrack,
          message: getRecommendationMessage(recommendedTrack),
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Submission failed" });
    }
  });

  // ==================== CONTACT ROUTES ====================

  // Submit contact message
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const result = insertContactMessageSchema.safeParse(req.body);
      if (!result.success) {
        const error = fromZodError(result.error);
        return res.status(400).json({ message: error.message });
      }

      const message = await storage.createContactMessage(result.data);
      res.status(201).json({ message: "Message sent successfully", id: message.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to send message" });
    }
  });

  // ==================== ADMIN ROUTES ====================

  // Get all contact messages (admin only)
  app.get("/api/admin/messages", isAdmin, async (req: Request, res: Response) => {
    try {
      const messages = await storage.getContactMessages();
      res.json({ messages });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch messages" });
    }
  });

  return httpServer;
}

// Helper function for placement recommendations
function getRecommendationMessage(track: string): string {
  switch (track) {
    case "foundations":
      return "Based on your responses, we recommend starting with our Foundations track (A0-A1). This 8-week program is perfect for building a strong foundation in English.";
    case "confidence":
      return "Based on your responses, we recommend our Confidence track (A2-B1). This 8-week program will help you develop fluency and confidence in everyday conversations.";
    case "cafe":
      return "Great news! Your English level is strong enough to join our English Café community directly. Practice your skills in a relaxed, social environment.";
    default:
      return "We recommend contacting us to discuss the best learning path for you.";
  }
}
