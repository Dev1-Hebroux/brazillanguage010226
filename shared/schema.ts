import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("student"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserRole = "student" | "trainer" | "admin";

export const cohortApplications = pgTable("cohort_applications", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  trackId: text("track_id").notNull(),
  englishLevel: text("english_level").notNull(),
  motivation: text("motivation"),
  status: text("status").notNull().default("pending"),
  emailOptIn: boolean("email_opt_in").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCohortApplicationSchema = createInsertSchema(cohortApplications).omit({
  id: true,
  status: true,
  emailOptIn: true,
  createdAt: true,
});

export type InsertCohortApplication = z.infer<typeof insertCohortApplicationSchema>;
export type CohortApplication = typeof cohortApplications.$inferSelect;

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  locationDetail: text("location_detail"),
  maxSpots: integer("max_spots").default(25),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export const eventRsvps = pgTable("event_rsvps", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  emailOptIn: boolean("email_opt_in").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEventRsvpSchema = createInsertSchema(eventRsvps).omit({
  id: true,
  emailOptIn: true,
  createdAt: true,
});

export type InsertEventRsvp = z.infer<typeof insertEventRsvpSchema>;
export type EventRsvp = typeof eventRsvps.$inferSelect;

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

// ─── Email Queue ──────────────────────────────────────────────

export const emailQueue = pgTable("email_queue", {
  id: serial("id").primaryKey(),
  to: text("to").notNull(),
  subject: text("subject").notNull(),
  html: text("html").notNull(),
  status: text("status").notNull().default("pending"),
  scheduledFor: timestamp("scheduled_for").notNull(),
  sentAt: timestamp("sent_at"),
  errorMessage: text("error_message"),
  triggerType: text("trigger_type"),
  triggerRefId: integer("trigger_ref_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type EmailQueueItem = typeof emailQueue.$inferSelect;

// ─── Email Campaigns ─────────────────────────────────────────

export const emailCampaigns = pgTable("email_campaigns", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  audience: text("audience").notNull().default("all"),
  status: text("status").notNull().default("draft"),
  sentCount: integer("sent_count").default(0),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  sentAt: timestamp("sent_at"),
});

export type EmailCampaign = typeof emailCampaigns.$inferSelect;

// ─── Google Form Links ──────────────────────────────────────

export const googleFormLinks = pgTable("google_form_links", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  formUrl: text("form_url").notNull(),
  sheetCsvUrl: text("sheet_csv_url"),
  linkedTo: text("linked_to").notNull().default("general"),
  linkedId: text("linked_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type GoogleFormLink = typeof googleFormLinks.$inferSelect;
