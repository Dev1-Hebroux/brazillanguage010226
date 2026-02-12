import {
  type User, type InsertUser,
  type CohortApplication, type InsertCohortApplication,
  type Event, type InsertEvent,
  type EventRsvp, type InsertEventRsvp,
  type ContactMessage, type InsertContactMessage,
  type EmailQueueItem, type EmailCampaign,
  type GoogleFormLink,
  users, cohortApplications, events, eventRsvps, contactMessages,
  emailQueue, emailCampaigns, googleFormLinks
} from "@shared/schema";
import { db } from "../db";
import { eq, desc, lte, and, inArray } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  updateUserRole(id: string, role: string): Promise<User | undefined>;

  createCohortApplication(app: InsertCohortApplication): Promise<CohortApplication>;
  getCohortApplications(): Promise<CohortApplication[]>;
  getCohortApplicationByEmail(email: string, trackId: string): Promise<CohortApplication | undefined>;
  updateCohortApplicationStatus(id: number, status: string): Promise<CohortApplication | undefined>;
  deleteCohortApplication(id: number): Promise<boolean>;
  bulkUpdateApplicationStatus(ids: number[], status: string): Promise<number>;

  createEvent(event: InsertEvent): Promise<Event>;
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  updateEvent(id: number, data: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;

  createEventRsvp(rsvp: InsertEventRsvp): Promise<EventRsvp>;
  getEventRsvps(eventId: number): Promise<EventRsvp[]>;
  getAllEventRsvps(): Promise<EventRsvp[]>;
  getEventRsvpCount(eventId: number): Promise<number>;
  getEventRsvpByEmail(eventId: number, email: string): Promise<EventRsvp | undefined>;
  deleteEventRsvp(id: number): Promise<boolean>;

  createContactMessage(msg: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  deleteContactMessage(id: number): Promise<boolean>;
  markContactMessageRead(id: number): Promise<void>;

  // Email queue
  enqueueEmail(data: { to: string; subject: string; html: string; scheduledFor: Date; triggerType?: string; triggerRefId?: number }): Promise<EmailQueueItem>;
  getPendingEmails(limit: number): Promise<EmailQueueItem[]>;
  markEmailSent(id: number): Promise<void>;
  markEmailFailed(id: number, errorMessage: string): Promise<void>;
  getEmailLog(limit: number): Promise<EmailQueueItem[]>;

  // Email campaigns
  createCampaign(data: { subject: string; body: string; audience: string; createdBy?: string }): Promise<EmailCampaign>;
  getCampaigns(): Promise<EmailCampaign[]>;
  getCampaign(id: number): Promise<EmailCampaign | undefined>;
  updateCampaignStatus(id: number, status: string, sentCount?: number): Promise<EmailCampaign | undefined>;

  // Google Forms
  createGoogleFormLink(data: { title: string; formUrl: string; sheetCsvUrl?: string; linkedTo: string; linkedId?: string }): Promise<GoogleFormLink>;
  getGoogleFormLinks(): Promise<GoogleFormLink[]>;
  deleteGoogleFormLink(id: number): Promise<boolean>;

  // Admin stats
  getAdminStats(): Promise<{
    applications: { total: number; pending: number; approved: number; rejected: number };
    students: { total: number; byTrack: Record<string, number> };
    events: { total: number; totalRsvps: number };
    messages: { total: number; unread: number };
    emailsSent: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async updateUserRole(id: string, role: string): Promise<User | undefined> {
    const [user] = await db.update(users).set({ role }).where(eq(users.id, id)).returning();
    return user;
  }

  async createCohortApplication(app: InsertCohortApplication): Promise<CohortApplication> {
    const [result] = await db.insert(cohortApplications).values(app).returning();
    return result;
  }

  async getCohortApplications(): Promise<CohortApplication[]> {
    return db.select().from(cohortApplications).orderBy(desc(cohortApplications.createdAt));
  }

  async getCohortApplicationByEmail(email: string, trackId: string): Promise<CohortApplication | undefined> {
    const [result] = await db.select().from(cohortApplications)
      .where(eq(cohortApplications.email, email));
    return result && result.trackId === trackId ? result : undefined;
  }

  async updateCohortApplicationStatus(id: number, status: string): Promise<CohortApplication | undefined> {
    const [result] = await db.update(cohortApplications).set({ status }).where(eq(cohortApplications.id, id)).returning();
    return result;
  }

  async deleteCohortApplication(id: number): Promise<boolean> {
    const result = await db.delete(cohortApplications).where(eq(cohortApplications.id, id)).returning();
    return result.length > 0;
  }

  async bulkUpdateApplicationStatus(ids: number[], status: string): Promise<number> {
    if (ids.length === 0) return 0;
    const result = await db.update(cohortApplications)
      .set({ status })
      .where(inArray(cohortApplications.id, ids))
      .returning();
    return result.length;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [result] = await db.insert(events).values(event).returning();
    return result;
  }

  async getEvents(): Promise<Event[]> {
    return db.select().from(events).orderBy(desc(events.createdAt));
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [result] = await db.select().from(events).where(eq(events.id, id));
    return result;
  }

  async updateEvent(id: number, data: Partial<InsertEvent>): Promise<Event | undefined> {
    const [result] = await db.update(events).set(data).where(eq(events.id, id)).returning();
    return result;
  }

  async deleteEvent(id: number): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id)).returning();
    return result.length > 0;
  }

  async createEventRsvp(rsvp: InsertEventRsvp): Promise<EventRsvp> {
    const [result] = await db.insert(eventRsvps).values(rsvp).returning();
    return result;
  }

  async getEventRsvps(eventId: number): Promise<EventRsvp[]> {
    return db.select().from(eventRsvps).where(eq(eventRsvps.eventId, eventId));
  }

  async getAllEventRsvps(): Promise<EventRsvp[]> {
    return db.select().from(eventRsvps).orderBy(desc(eventRsvps.createdAt));
  }

  async getEventRsvpCount(eventId: number): Promise<number> {
    const rsvps = await db.select().from(eventRsvps).where(eq(eventRsvps.eventId, eventId));
    return rsvps.length;
  }

  async getEventRsvpByEmail(eventId: number, email: string): Promise<EventRsvp | undefined> {
    const rsvps = await db.select().from(eventRsvps)
      .where(eq(eventRsvps.eventId, eventId));
    return rsvps.find(r => r.email === email);
  }

  async deleteEventRsvp(id: number): Promise<boolean> {
    const result = await db.delete(eventRsvps).where(eq(eventRsvps.id, id)).returning();
    return result.length > 0;
  }

  async createContactMessage(msg: InsertContactMessage): Promise<ContactMessage> {
    const [result] = await db.insert(contactMessages).values(msg).returning();
    return result;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    const result = await db.delete(contactMessages).where(eq(contactMessages.id, id)).returning();
    return result.length > 0;
  }

  async markContactMessageRead(id: number): Promise<void> {
    await db.update(contactMessages).set({ isRead: true }).where(eq(contactMessages.id, id));
  }

  // ─── Email Queue ────────────────────────────────────────────

  async enqueueEmail(data: { to: string; subject: string; html: string; scheduledFor: Date; triggerType?: string; triggerRefId?: number }): Promise<EmailQueueItem> {
    const [result] = await db.insert(emailQueue).values(data).returning();
    return result;
  }

  async getPendingEmails(limit: number): Promise<EmailQueueItem[]> {
    return db.select().from(emailQueue)
      .where(and(eq(emailQueue.status, "pending"), lte(emailQueue.scheduledFor, new Date())))
      .orderBy(emailQueue.scheduledFor)
      .limit(limit);
  }

  async markEmailSent(id: number): Promise<void> {
    await db.update(emailQueue).set({ status: "sent", sentAt: new Date() }).where(eq(emailQueue.id, id));
  }

  async markEmailFailed(id: number, errorMessage: string): Promise<void> {
    await db.update(emailQueue).set({ status: "failed", errorMessage }).where(eq(emailQueue.id, id));
  }

  async getEmailLog(limit: number): Promise<EmailQueueItem[]> {
    return db.select().from(emailQueue).orderBy(desc(emailQueue.createdAt)).limit(limit);
  }

  // ─── Email Campaigns ───────────────────────────────────────

  async createCampaign(data: { subject: string; body: string; audience: string; createdBy?: string }): Promise<EmailCampaign> {
    const [result] = await db.insert(emailCampaigns).values(data).returning();
    return result;
  }

  async getCampaigns(): Promise<EmailCampaign[]> {
    return db.select().from(emailCampaigns).orderBy(desc(emailCampaigns.createdAt));
  }

  async getCampaign(id: number): Promise<EmailCampaign | undefined> {
    const [result] = await db.select().from(emailCampaigns).where(eq(emailCampaigns.id, id));
    return result;
  }

  async updateCampaignStatus(id: number, status: string, sentCount?: number): Promise<EmailCampaign | undefined> {
    const updates: any = { status };
    if (status === "sent") updates.sentAt = new Date();
    if (sentCount !== undefined) updates.sentCount = sentCount;
    const [result] = await db.update(emailCampaigns).set(updates).where(eq(emailCampaigns.id, id)).returning();
    return result;
  }

  // ─── Google Forms ──────────────────────────────────────────

  async createGoogleFormLink(data: { title: string; formUrl: string; sheetCsvUrl?: string; linkedTo: string; linkedId?: string }): Promise<GoogleFormLink> {
    const [result] = await db.insert(googleFormLinks).values(data).returning();
    return result;
  }

  async getGoogleFormLinks(): Promise<GoogleFormLink[]> {
    return db.select().from(googleFormLinks).orderBy(desc(googleFormLinks.createdAt));
  }

  async deleteGoogleFormLink(id: number): Promise<boolean> {
    const result = await db.delete(googleFormLinks).where(eq(googleFormLinks.id, id)).returning();
    return result.length > 0;
  }

  // ─── Admin Stats ───────────────────────────────────────────

  async getAdminStats() {
    const apps = await db.select().from(cohortApplications);
    const allEvents = await db.select().from(events);
    const allRsvps = await db.select().from(eventRsvps);
    const msgs = await db.select().from(contactMessages);
    const sentEmails = await db.select().from(emailQueue).where(eq(emailQueue.status, "sent"));

    const pending = apps.filter(a => a.status === "pending").length;
    const approved = apps.filter(a => a.status === "approved").length;
    const rejected = apps.filter(a => a.status === "rejected").length;

    const byTrack: Record<string, number> = {};
    for (const a of apps.filter(a => a.status === "approved")) {
      byTrack[a.trackId] = (byTrack[a.trackId] || 0) + 1;
    }

    const unread = msgs.filter(m => !m.isRead).length;

    return {
      applications: { total: apps.length, pending, approved, rejected },
      students: { total: approved, byTrack },
      events: { total: allEvents.length, totalRsvps: allRsvps.length },
      messages: { total: msgs.length, unread },
      emailsSent: sentEmails.length,
    };
  }
}

export const storage = new DatabaseStorage();
