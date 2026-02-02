import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - core user accounts
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  preferredLanguage: text("preferred_language").default("pt").notNull(),
  role: text("role").default("student").notNull(), // student, instructor, admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Cohorts - learning track instances
export const cohorts = pgTable("cohorts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  track: text("track").notNull(), // foundations, confidence, cafe
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  maxStudents: integer("max_students").default(30),
  whatsappLink: text("whatsapp_link"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Enrollments - students enrolled in cohorts
export const enrollments = pgTable("enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  cohortId: varchar("cohort_id").notNull().references(() => cohorts.id),
  status: text("status").default("active").notNull(), // active, completed, dropped
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Lessons - individual lesson content
export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  track: text("track").notNull(), // foundations, confidence
  week: integer("week").notNull(),
  day: integer("day").notNull(), // 1-6
  title: text("title").notNull(),
  titlePt: text("title_pt").notNull(),
  type: text("type").notNull(), // vocabulary, grammar, listening, speaking, review
  content: jsonb("content").notNull(), // flexible JSON for lesson content
  duration: integer("duration").default(10), // minutes
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Progress - student progress through lessons
export const progress = pgTable("progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  lessonId: varchar("lesson_id").notNull().references(() => lessons.id),
  cohortId: varchar("cohort_id").references(() => cohorts.id),
  status: text("status").default("not_started").notNull(), // not_started, in_progress, completed
  score: integer("score"), // quiz score if applicable
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Events - English Café meetups and other events
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titlePt: text("title_pt").notNull(),
  description: text("description"),
  descriptionPt: text("description_pt"),
  eventDate: timestamp("event_date").notNull(),
  location: text("location").notNull(),
  locationUrl: text("location_url"), // Google Maps link
  maxAttendees: integer("max_attendees"),
  eventType: text("event_type").default("cafe").notNull(), // cafe, workshop, special
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Event Registrations
export const eventRegistrations = pgTable("event_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  eventId: varchar("event_id").notNull().references(() => events.id),
  status: text("status").default("registered").notNull(), // registered, attended, cancelled
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
});

// Placement Quiz Responses
export const placementResponses = pgTable("placement_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  email: text("email").notNull(),
  name: text("name").notNull(),
  responses: jsonb("responses").notNull(),
  recommendedTrack: text("recommended_track").notNull(),
  score: integer("score").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Contact Messages
export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod Schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const registerUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  preferredLanguage: z.enum(["en", "pt"]).default("pt"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const insertCohortSchema = createInsertSchema(cohorts).omit({
  id: true,
  createdAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
});

export const insertProgressSchema = createInsertSchema(progress).omit({
  id: true,
  createdAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});

export const insertEventRegistrationSchema = createInsertSchema(eventRegistrations).omit({
  id: true,
  registeredAt: true,
});

export const insertPlacementResponseSchema = createInsertSchema(placementResponses).omit({
  id: true,
  createdAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;

export type Cohort = typeof cohorts.$inferSelect;
export type InsertCohort = z.infer<typeof insertCohortSchema>;

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;

export type Progress = typeof progress.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertEventRegistration = z.infer<typeof insertEventRegistrationSchema>;

export type PlacementResponse = typeof placementResponses.$inferSelect;
export type InsertPlacementResponse = z.infer<typeof insertPlacementResponseSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
