import {
  type User, type InsertUser,
  type CohortApplication, type InsertCohortApplication,
  type Event, type InsertEvent,
  type EventRsvp, type InsertEventRsvp,
  type ContactMessage, type InsertContactMessage,
  users, cohortApplications, events, eventRsvps, contactMessages
} from "@shared/schema";
import { db } from "../db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createCohortApplication(app: InsertCohortApplication): Promise<CohortApplication>;
  getCohortApplications(): Promise<CohortApplication[]>;
  getCohortApplicationByEmail(email: string, trackId: string): Promise<CohortApplication | undefined>;

  createEvent(event: InsertEvent): Promise<Event>;
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;

  createEventRsvp(rsvp: InsertEventRsvp): Promise<EventRsvp>;
  getEventRsvps(eventId: number): Promise<EventRsvp[]>;
  getEventRsvpCount(eventId: number): Promise<number>;
  getEventRsvpByEmail(eventId: number, email: string): Promise<EventRsvp | undefined>;

  createContactMessage(msg: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
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

  async createEventRsvp(rsvp: InsertEventRsvp): Promise<EventRsvp> {
    const [result] = await db.insert(eventRsvps).values(rsvp).returning();
    return result;
  }

  async getEventRsvps(eventId: number): Promise<EventRsvp[]> {
    return db.select().from(eventRsvps).where(eq(eventRsvps.eventId, eventId));
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

  async createContactMessage(msg: InsertContactMessage): Promise<ContactMessage> {
    const [result] = await db.insert(contactMessages).values(msg).returning();
    return result;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }
}

export const storage = new DatabaseStorage();
