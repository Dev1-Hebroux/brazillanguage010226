import {
  type User, type InsertUser, type RegisterUser,
  type Cohort, type InsertCohort,
  type Enrollment, type InsertEnrollment,
  type Lesson, type InsertLesson,
  type Progress, type InsertProgress,
  type Event, type InsertEvent,
  type EventRegistration, type InsertEventRegistration,
  type PlacementResponse, type InsertPlacementResponse,
  type ContactMessage, type InsertContactMessage,
  users, cohorts, enrollments, lessons, progress, events, eventRegistrations, placementResponses, contactMessages
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import { db } from "./db";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

// Storage interface
export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: RegisterUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;

  // Cohorts
  getCohorts(): Promise<Cohort[]>;
  getCohort(id: string): Promise<Cohort | undefined>;
  getActiveCohorts(): Promise<Cohort[]>;
  getCohortsByTrack(track: string): Promise<Cohort[]>;
  createCohort(cohort: InsertCohort): Promise<Cohort>;

  // Enrollments
  getEnrollment(userId: string, cohortId: string): Promise<Enrollment | undefined>;
  getUserEnrollments(userId: string): Promise<Enrollment[]>;
  getCohortEnrollments(cohortId: string): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollment(id: string, data: Partial<Enrollment>): Promise<Enrollment | undefined>;

  // Lessons
  getLessons(): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;
  getLessonsByTrack(track: string): Promise<Lesson[]>;
  getLessonsByWeek(track: string, week: number): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  // Progress
  getProgress(userId: string, lessonId: string): Promise<Progress | undefined>;
  getUserProgress(userId: string): Promise<Progress[]>;
  getUserProgressByCohort(userId: string, cohortId: string): Promise<Progress[]>;
  createProgress(progress: InsertProgress): Promise<Progress>;
  updateProgress(id: string, data: Partial<Progress>): Promise<Progress | undefined>;

  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  getActiveEvents(): Promise<Event[]>;
  getUpcomingEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;

  // Event Registrations
  getEventRegistration(userId: string, eventId: string): Promise<EventRegistration | undefined>;
  getUserEventRegistrations(userId: string): Promise<EventRegistration[]>;
  getEventRegistrations(eventId: string): Promise<EventRegistration[]>;
  createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration>;
  updateEventRegistration(id: string, data: Partial<EventRegistration>): Promise<EventRegistration | undefined>;

  // Placement
  createPlacementResponse(response: InsertPlacementResponse): Promise<PlacementResponse>;
  getPlacementResponseByEmail(email: string): Promise<PlacementResponse | undefined>;

  // Contact
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    return user;
  }

  async createUser(registerData: RegisterUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(registerData.password, 10);
    const [user] = await db.insert(users).values({
      email: registerData.email.toLowerCase(),
      password: hashedPassword,
      name: registerData.name,
      phone: registerData.phone,
      preferredLanguage: registerData.preferredLanguage || "pt",
      role: "student",
    }).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return user;
  }

  // Cohorts
  async getCohorts(): Promise<Cohort[]> {
    return db.select().from(cohorts).orderBy(desc(cohorts.startDate));
  }

  async getCohort(id: string): Promise<Cohort | undefined> {
    const [cohort] = await db.select().from(cohorts).where(eq(cohorts.id, id));
    return cohort;
  }

  async getActiveCohorts(): Promise<Cohort[]> {
    return db.select().from(cohorts).where(eq(cohorts.isActive, true)).orderBy(desc(cohorts.startDate));
  }

  async getCohortsByTrack(track: string): Promise<Cohort[]> {
    return db.select().from(cohorts).where(and(eq(cohorts.track, track), eq(cohorts.isActive, true))).orderBy(desc(cohorts.startDate));
  }

  async createCohort(cohort: InsertCohort): Promise<Cohort> {
    const [newCohort] = await db.insert(cohorts).values(cohort).returning();
    return newCohort;
  }

  // Enrollments
  async getEnrollment(userId: string, cohortId: string): Promise<Enrollment | undefined> {
    const [enrollment] = await db.select().from(enrollments).where(and(eq(enrollments.userId, userId), eq(enrollments.cohortId, cohortId)));
    return enrollment;
  }

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    return db.select().from(enrollments).where(eq(enrollments.userId, userId));
  }

  async getCohortEnrollments(cohortId: string): Promise<Enrollment[]> {
    return db.select().from(enrollments).where(eq(enrollments.cohortId, cohortId));
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db.insert(enrollments).values(enrollment).returning();
    return newEnrollment;
  }

  async updateEnrollment(id: string, data: Partial<Enrollment>): Promise<Enrollment | undefined> {
    const [enrollment] = await db.update(enrollments).set(data).where(eq(enrollments.id, id)).returning();
    return enrollment;
  }

  // Lessons
  async getLessons(): Promise<Lesson[]> {
    return db.select().from(lessons).orderBy(lessons.track, lessons.week, lessons.day);
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  async getLessonsByTrack(track: string): Promise<Lesson[]> {
    return db.select().from(lessons).where(eq(lessons.track, track)).orderBy(lessons.week, lessons.day);
  }

  async getLessonsByWeek(track: string, week: number): Promise<Lesson[]> {
    return db.select().from(lessons).where(and(eq(lessons.track, track), eq(lessons.week, week))).orderBy(lessons.day);
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [newLesson] = await db.insert(lessons).values(lesson).returning();
    return newLesson;
  }

  // Progress
  async getProgress(userId: string, lessonId: string): Promise<Progress | undefined> {
    const [prog] = await db.select().from(progress).where(and(eq(progress.userId, userId), eq(progress.lessonId, lessonId)));
    return prog;
  }

  async getUserProgress(userId: string): Promise<Progress[]> {
    return db.select().from(progress).where(eq(progress.userId, userId));
  }

  async getUserProgressByCohort(userId: string, cohortId: string): Promise<Progress[]> {
    return db.select().from(progress).where(and(eq(progress.userId, userId), eq(progress.cohortId, cohortId)));
  }

  async createProgress(prog: InsertProgress): Promise<Progress> {
    const [newProgress] = await db.insert(progress).values(prog).returning();
    return newProgress;
  }

  async updateProgress(id: string, data: Partial<Progress>): Promise<Progress | undefined> {
    const [prog] = await db.update(progress).set(data).where(eq(progress.id, id)).returning();
    return prog;
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return db.select().from(events).orderBy(desc(events.eventDate));
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async getActiveEvents(): Promise<Event[]> {
    return db.select().from(events).where(eq(events.isActive, true)).orderBy(desc(events.eventDate));
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const now = new Date();
    return db.select().from(events).where(and(eq(events.isActive, true))).orderBy(events.eventDate);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  // Event Registrations
  async getEventRegistration(userId: string, eventId: string): Promise<EventRegistration | undefined> {
    const [registration] = await db.select().from(eventRegistrations).where(and(eq(eventRegistrations.userId, userId), eq(eventRegistrations.eventId, eventId)));
    return registration;
  }

  async getUserEventRegistrations(userId: string): Promise<EventRegistration[]> {
    return db.select().from(eventRegistrations).where(eq(eventRegistrations.userId, userId));
  }

  async getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
    return db.select().from(eventRegistrations).where(eq(eventRegistrations.eventId, eventId));
  }

  async createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration> {
    const [newRegistration] = await db.insert(eventRegistrations).values(registration).returning();
    return newRegistration;
  }

  async updateEventRegistration(id: string, data: Partial<EventRegistration>): Promise<EventRegistration | undefined> {
    const [registration] = await db.update(eventRegistrations).set(data).where(eq(eventRegistrations.id, id)).returning();
    return registration;
  }

  // Placement
  async createPlacementResponse(response: InsertPlacementResponse): Promise<PlacementResponse> {
    const [newResponse] = await db.insert(placementResponses).values(response).returning();
    return newResponse;
  }

  async getPlacementResponseByEmail(email: string): Promise<PlacementResponse | undefined> {
    const [response] = await db.select().from(placementResponses).where(eq(placementResponses.email, email.toLowerCase())).orderBy(desc(placementResponses.createdAt));
    return response;
  }

  // Contact
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }
}

// In-Memory Storage Implementation (for development/testing without database)
export class MemStorage implements IStorage {
  private usersMap: Map<string, User> = new Map();
  private cohortsMap: Map<string, Cohort> = new Map();
  private enrollmentsMap: Map<string, Enrollment> = new Map();
  private lessonsMap: Map<string, Lesson> = new Map();
  private progressMap: Map<string, Progress> = new Map();
  private eventsMap: Map<string, Event> = new Map();
  private eventRegistrationsMap: Map<string, EventRegistration> = new Map();
  private placementResponsesMap: Map<string, PlacementResponse> = new Map();
  private contactMessagesMap: Map<string, ContactMessage> = new Map();

  constructor() {
    // Seed with sample data
    this.seedData();
  }

  private seedData() {
    // Create sample cohorts
    const cohort1: Cohort = {
      id: "cohort-foundations-2024-01",
      name: "Foundations - January 2024",
      track: "foundations",
      description: "Complete beginners (A0-A1)",
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-03-28"),
      maxStudents: 30,
      whatsappLink: "https://chat.whatsapp.com/example",
      isActive: true,
      createdAt: new Date(),
    };

    const cohort2: Cohort = {
      id: "cohort-confidence-2024-01",
      name: "Confidence - January 2024",
      track: "confidence",
      description: "Low-intermediate (A2-B1)",
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-03-28"),
      maxStudents: 25,
      whatsappLink: "https://chat.whatsapp.com/example2",
      isActive: true,
      createdAt: new Date(),
    };

    this.cohortsMap.set(cohort1.id, cohort1);
    this.cohortsMap.set(cohort2.id, cohort2);

    // Create sample events
    const event1: Event = {
      id: "event-cafe-2024-02",
      title: "English Café - February",
      titlePt: "English Café - Fevereiro",
      description: "Practice your English in a relaxed café environment",
      descriptionPt: "Pratique seu inglês em um ambiente descontraído de café",
      eventDate: new Date("2024-02-10T14:00:00"),
      location: "Edifício Boulevard Centro Empresarial, SDS Bloco P, Loja 43, Asa Sul, Brasília - DF",
      locationUrl: "https://maps.google.com/?q=Edificio+Boulevard+Centro+Empresarial",
      maxAttendees: 40,
      eventType: "cafe",
      isActive: true,
      createdAt: new Date(),
    };

    this.eventsMap.set(event1.id, event1);

    // Create sample lessons
    const sampleLessons: Lesson[] = [
      {
        id: "lesson-f-w1-d1",
        track: "foundations",
        week: 1,
        day: 1,
        title: "Greetings & Introductions",
        titlePt: "Saudações e Apresentações",
        type: "vocabulary",
        content: {
          words: ["Hello", "Hi", "Good morning", "Good afternoon", "Good evening", "My name is...", "Nice to meet you"],
          examples: ["Hello! My name is Ana.", "Good morning! How are you?"],
          practice: "Record yourself saying hello and introducing yourself"
        },
        duration: 10,
        createdAt: new Date(),
      },
      {
        id: "lesson-f-w1-d2",
        track: "foundations",
        week: 1,
        day: 2,
        title: "The Verb 'To Be'",
        titlePt: "O Verbo 'Ser/Estar'",
        type: "grammar",
        content: {
          explanation: "The verb 'to be' is used to describe states and identities",
          forms: ["I am", "You are", "He/She/It is", "We are", "They are"],
          exercises: [
            { question: "I ___ a student.", answer: "am" },
            { question: "She ___ from Brazil.", answer: "is" }
          ]
        },
        duration: 15,
        createdAt: new Date(),
      },
      {
        id: "lesson-f-w1-d3",
        track: "foundations",
        week: 1,
        day: 3,
        title: "Numbers 1-20",
        titlePt: "Números 1-20",
        type: "vocabulary",
        content: {
          words: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"],
          audio: true,
          practice: "Practice counting from 1 to 20"
        },
        duration: 10,
        createdAt: new Date(),
      },
    ];

    sampleLessons.forEach(lesson => this.lessonsMap.set(lesson.id, lesson));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  async createUser(registerData: RegisterUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(registerData.password, 10);
    const user: User = {
      id,
      email: registerData.email.toLowerCase(),
      password: hashedPassword,
      name: registerData.name,
      phone: registerData.phone || null,
      preferredLanguage: registerData.preferredLanguage || "pt",
      role: "student",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.usersMap.set(id, user);
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const user = this.usersMap.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...data, updatedAt: new Date() };
    this.usersMap.set(id, updated);
    return updated;
  }

  // Cohorts
  async getCohorts(): Promise<Cohort[]> {
    return Array.from(this.cohortsMap.values()).sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }

  async getCohort(id: string): Promise<Cohort | undefined> {
    return this.cohortsMap.get(id);
  }

  async getActiveCohorts(): Promise<Cohort[]> {
    return Array.from(this.cohortsMap.values()).filter(c => c.isActive).sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }

  async getCohortsByTrack(track: string): Promise<Cohort[]> {
    return Array.from(this.cohortsMap.values()).filter(c => c.track === track && c.isActive).sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }

  async createCohort(cohort: InsertCohort): Promise<Cohort> {
    const id = randomUUID();
    const newCohort: Cohort = {
      id,
      name: cohort.name,
      track: cohort.track,
      description: cohort.description ?? null,
      startDate: cohort.startDate,
      endDate: cohort.endDate,
      maxStudents: cohort.maxStudents ?? null,
      whatsappLink: cohort.whatsappLink ?? null,
      isActive: cohort.isActive ?? true,
      createdAt: new Date(),
    };
    this.cohortsMap.set(id, newCohort);
    return newCohort;
  }

  // Enrollments
  async getEnrollment(userId: string, cohortId: string): Promise<Enrollment | undefined> {
    return Array.from(this.enrollmentsMap.values()).find(e => e.userId === userId && e.cohortId === cohortId);
  }

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    return Array.from(this.enrollmentsMap.values()).filter(e => e.userId === userId);
  }

  async getCohortEnrollments(cohortId: string): Promise<Enrollment[]> {
    return Array.from(this.enrollmentsMap.values()).filter(e => e.cohortId === cohortId);
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const id = randomUUID();
    const newEnrollment: Enrollment = {
      id,
      userId: enrollment.userId,
      cohortId: enrollment.cohortId,
      status: enrollment.status ?? "active",
      enrolledAt: new Date(),
      completedAt: null,
    };
    this.enrollmentsMap.set(id, newEnrollment);
    return newEnrollment;
  }

  async updateEnrollment(id: string, data: Partial<Enrollment>): Promise<Enrollment | undefined> {
    const enrollment = this.enrollmentsMap.get(id);
    if (!enrollment) return undefined;
    const updated = { ...enrollment, ...data };
    this.enrollmentsMap.set(id, updated);
    return updated;
  }

  // Lessons
  async getLessons(): Promise<Lesson[]> {
    return Array.from(this.lessonsMap.values()).sort((a, b) => {
      if (a.track !== b.track) return a.track.localeCompare(b.track);
      if (a.week !== b.week) return a.week - b.week;
      return a.day - b.day;
    });
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    return this.lessonsMap.get(id);
  }

  async getLessonsByTrack(track: string): Promise<Lesson[]> {
    return Array.from(this.lessonsMap.values()).filter(l => l.track === track).sort((a, b) => {
      if (a.week !== b.week) return a.week - b.week;
      return a.day - b.day;
    });
  }

  async getLessonsByWeek(track: string, week: number): Promise<Lesson[]> {
    return Array.from(this.lessonsMap.values()).filter(l => l.track === track && l.week === week).sort((a, b) => a.day - b.day);
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const id = randomUUID();
    const newLesson: Lesson = {
      id,
      track: lesson.track,
      week: lesson.week,
      day: lesson.day,
      title: lesson.title,
      titlePt: lesson.titlePt,
      type: lesson.type,
      content: lesson.content,
      duration: lesson.duration ?? null,
      createdAt: new Date(),
    };
    this.lessonsMap.set(id, newLesson);
    return newLesson;
  }

  // Progress
  async getProgress(userId: string, lessonId: string): Promise<Progress | undefined> {
    return Array.from(this.progressMap.values()).find(p => p.userId === userId && p.lessonId === lessonId);
  }

  async getUserProgress(userId: string): Promise<Progress[]> {
    return Array.from(this.progressMap.values()).filter(p => p.userId === userId);
  }

  async getUserProgressByCohort(userId: string, cohortId: string): Promise<Progress[]> {
    return Array.from(this.progressMap.values()).filter(p => p.userId === userId && p.cohortId === cohortId);
  }

  async createProgress(prog: InsertProgress): Promise<Progress> {
    const id = randomUUID();
    const newProgress: Progress = {
      id,
      userId: prog.userId,
      lessonId: prog.lessonId,
      cohortId: prog.cohortId ?? null,
      status: prog.status ?? "not_started",
      score: prog.score ?? null,
      completedAt: prog.completedAt ?? null,
      createdAt: new Date(),
    };
    this.progressMap.set(id, newProgress);
    return newProgress;
  }

  async updateProgress(id: string, data: Partial<Progress>): Promise<Progress | undefined> {
    const prog = this.progressMap.get(id);
    if (!prog) return undefined;
    const updated = { ...prog, ...data };
    this.progressMap.set(id, updated);
    return updated;
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return Array.from(this.eventsMap.values()).sort((a, b) => b.eventDate.getTime() - a.eventDate.getTime());
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.eventsMap.get(id);
  }

  async getActiveEvents(): Promise<Event[]> {
    return Array.from(this.eventsMap.values()).filter(e => e.isActive).sort((a, b) => b.eventDate.getTime() - a.eventDate.getTime());
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const now = new Date();
    return Array.from(this.eventsMap.values()).filter(e => e.isActive && e.eventDate >= now).sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const newEvent: Event = {
      id,
      title: event.title,
      titlePt: event.titlePt,
      description: event.description ?? null,
      descriptionPt: event.descriptionPt ?? null,
      eventDate: event.eventDate,
      location: event.location,
      locationUrl: event.locationUrl ?? null,
      maxAttendees: event.maxAttendees ?? null,
      eventType: event.eventType ?? "cafe",
      isActive: event.isActive ?? true,
      createdAt: new Date(),
    };
    this.eventsMap.set(id, newEvent);
    return newEvent;
  }

  // Event Registrations
  async getEventRegistration(userId: string, eventId: string): Promise<EventRegistration | undefined> {
    return Array.from(this.eventRegistrationsMap.values()).find(r => r.userId === userId && r.eventId === eventId);
  }

  async getUserEventRegistrations(userId: string): Promise<EventRegistration[]> {
    return Array.from(this.eventRegistrationsMap.values()).filter(r => r.userId === userId);
  }

  async getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
    return Array.from(this.eventRegistrationsMap.values()).filter(r => r.eventId === eventId);
  }

  async createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration> {
    const id = randomUUID();
    const newRegistration: EventRegistration = {
      id,
      userId: registration.userId,
      eventId: registration.eventId,
      status: registration.status ?? "registered",
      registeredAt: new Date(),
    };
    this.eventRegistrationsMap.set(id, newRegistration);
    return newRegistration;
  }

  async updateEventRegistration(id: string, data: Partial<EventRegistration>): Promise<EventRegistration | undefined> {
    const registration = this.eventRegistrationsMap.get(id);
    if (!registration) return undefined;
    const updated = { ...registration, ...data };
    this.eventRegistrationsMap.set(id, updated);
    return updated;
  }

  // Placement
  async createPlacementResponse(response: InsertPlacementResponse): Promise<PlacementResponse> {
    const id = randomUUID();
    const newResponse: PlacementResponse = {
      id,
      userId: response.userId ?? null,
      email: response.email,
      name: response.name,
      responses: response.responses,
      recommendedTrack: response.recommendedTrack,
      score: response.score,
      createdAt: new Date(),
    };
    this.placementResponsesMap.set(id, newResponse);
    return newResponse;
  }

  async getPlacementResponseByEmail(email: string): Promise<PlacementResponse | undefined> {
    const responses = Array.from(this.placementResponsesMap.values()).filter(r => r.email.toLowerCase() === email.toLowerCase());
    return responses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  }

  // Contact
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const newMessage: ContactMessage = {
      id,
      name: message.name,
      email: message.email,
      subject: message.subject ?? null,
      message: message.message,
      isRead: false,
      createdAt: new Date(),
    };
    this.contactMessagesMap.set(id, newMessage);
    return newMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessagesMap.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

// Export storage instance - use MemStorage for now (database can be enabled when DATABASE_URL is set)
export const storage: IStorage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
