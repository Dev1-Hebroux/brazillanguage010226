import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
interface Cohort {
  id: string;
  name: string;
  track: string;
  description: string | null;
  startDate: string;
  endDate: string;
  maxStudents: number | null;
  whatsappLink: string | null;
  isActive: boolean;
  createdAt: string;
}

interface Enrollment {
  id: string;
  userId: string;
  cohortId: string;
  status: string;
  enrolledAt: string;
  completedAt: string | null;
}

interface Lesson {
  id: string;
  track: string;
  week: number;
  day: number;
  title: string;
  titlePt: string;
  type: string;
  content: any;
  duration: number | null;
  createdAt: string;
}

interface Progress {
  id: string;
  userId: string;
  lessonId: string;
  cohortId: string | null;
  status: string;
  score: number | null;
  completedAt: string | null;
  createdAt: string;
}

interface Event {
  id: string;
  title: string;
  titlePt: string;
  description: string | null;
  descriptionPt: string | null;
  eventDate: string;
  location: string;
  locationUrl: string | null;
  maxAttendees: number | null;
  eventType: string;
  isActive: boolean;
  createdAt: string;
}

interface EventRegistration {
  id: string;
  userId: string;
  eventId: string;
  status: string;
  registeredAt: string;
}

// API helpers
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }
  return res.json();
}

// Cohorts
export function useCohorts(track?: string) {
  return useQuery({
    queryKey: ["cohorts", track],
    queryFn: () =>
      apiRequest<{ cohorts: Cohort[] }>(
        `/api/cohorts${track ? `?track=${track}` : ""}`
      ).then((data) => data.cohorts),
  });
}

export function useCohort(id: string) {
  return useQuery({
    queryKey: ["cohorts", id],
    queryFn: () =>
      apiRequest<{ cohort: Cohort }>(`/api/cohorts/${id}`).then(
        (data) => data.cohort
      ),
    enabled: !!id,
  });
}

// Enrollments
export function useEnrollments() {
  return useQuery({
    queryKey: ["enrollments"],
    queryFn: () =>
      apiRequest<{ enrollments: Enrollment[] }>("/api/enrollments").then(
        (data) => data.enrollments
      ),
  });
}

export function useEnroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cohortId: string) =>
      apiRequest<{ enrollment: Enrollment; whatsappLink: string | null }>(
        "/api/enrollments",
        {
          method: "POST",
          body: JSON.stringify({ cohortId }),
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
}

// Lessons
export function useLessons(track?: string, week?: number) {
  return useQuery({
    queryKey: ["lessons", track, week],
    queryFn: () => {
      const params = new URLSearchParams();
      if (track) params.append("track", track);
      if (week) params.append("week", week.toString());
      const query = params.toString();
      return apiRequest<{ lessons: Lesson[] }>(
        `/api/lessons${query ? `?${query}` : ""}`
      ).then((data) => data.lessons);
    },
  });
}

export function useLesson(id: string) {
  return useQuery({
    queryKey: ["lessons", id],
    queryFn: () =>
      apiRequest<{ lesson: Lesson }>(`/api/lessons/${id}`).then(
        (data) => data.lesson
      ),
    enabled: !!id,
  });
}

// Progress
export function useProgress(cohortId?: string) {
  return useQuery({
    queryKey: ["progress", cohortId],
    queryFn: () =>
      apiRequest<{ progress: Progress[] }>(
        `/api/progress${cohortId ? `?cohortId=${cohortId}` : ""}`
      ).then((data) => data.progress),
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      lessonId: string;
      cohortId?: string;
      status?: string;
      score?: number;
    }) =>
      apiRequest<{ progress: Progress }>("/api/progress", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
}

// Events
export function useEvents(upcoming?: boolean) {
  return useQuery({
    queryKey: ["events", upcoming],
    queryFn: () =>
      apiRequest<{ events: Event[] }>(
        `/api/events${upcoming ? "?upcoming=true" : ""}`
      ).then((data) => data.events),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["events", id],
    queryFn: () =>
      apiRequest<{
        event: Event;
        registrationCount: number;
        spotsAvailable: number | null;
      }>(`/api/events/${id}`),
    enabled: !!id,
  });
}

// Event Registrations
export function useEventRegistrations() {
  return useQuery({
    queryKey: ["eventRegistrations"],
    queryFn: () =>
      apiRequest<{ registrations: EventRegistration[] }>(
        "/api/event-registrations"
      ).then((data) => data.registrations),
  });
}

export function useRegisterForEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) =>
      apiRequest<{ registration: EventRegistration }>(
        "/api/event-registrations",
        {
          method: "POST",
          body: JSON.stringify({ eventId }),
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventRegistrations"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useCancelEventRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) =>
      apiRequest<{ message: string }>(`/api/event-registrations/${eventId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventRegistrations"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

// Placement Quiz
export function useSubmitPlacement() {
  return useMutation({
    mutationFn: (data: {
      email: string;
      name: string;
      responses: any;
      score: number;
    }) =>
      apiRequest<{
        response: any;
        recommendation: { track: string; message: string };
      }>("/api/placement", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });
}

// Contact
export function useSubmitContact() {
  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      subject?: string;
      message: string;
    }) =>
      apiRequest<{ message: string; id: string }>("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });
}
