import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Shield, LogIn, Loader2, Users, CalendarDays, Mail, FileText,
  Trash2, CheckCircle, XCircle, Plus, Clock, Send
} from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  return <Badge className={map[status] ?? "bg-gray-100 text-gray-800"}>{status}</Badge>;
}

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    admin: "bg-purple-100 text-purple-800",
    trainer: "bg-blue-100 text-blue-800",
    student: "bg-gray-100 text-gray-800",
  };
  return <Badge className={map[role] ?? "bg-gray-100 text-gray-800"}>{role}</Badge>;
}

// ─── Applications Tab ──────────────────────────────────────────

function ApplicationsTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [sendEmail, setSendEmail] = useState(true);

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["/api/admin/applications"],
    queryFn: async () => {
      const res = await fetch("/api/admin/applications", { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status, sendEmail }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      toast({ title: "Status updated" });
    },
  });

  const deleteApp = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      toast({ title: "Application deleted" });
    },
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Cohort Applications ({apps.length})</CardTitle>
        <div className="flex items-center gap-2">
          <Checkbox
            id="send-email"
            checked={sendEmail}
            onCheckedChange={(checked) => setSendEmail(checked === true)}
          />
          <Label htmlFor="send-email" className="text-sm text-muted-foreground cursor-pointer">
            Email on approve/reject
          </Label>
        </div>
      </CardHeader>
      <CardContent>
        {apps.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No applications yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead>Track</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps.map((app: any) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.fullName}</TableCell>
                  <TableCell className="hidden sm:table-cell">{app.email}</TableCell>
                  <TableCell><Badge variant="outline">{app.trackId}</Badge></TableCell>
                  <TableCell><StatusBadge status={app.status} /></TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-green-600"
                        onClick={() => updateStatus.mutate({ id: app.id, status: "approved" })}
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-600"
                        onClick={() => updateStatus.mutate({ id: app.id, status: "rejected" })}
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-muted-foreground"
                        onClick={() => deleteApp.mutate(app.id)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Events Tab ────────────────────────────────────────────────

function EventsTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    locationDetail: "",
    maxSpots: 25,
    isActive: true,
  });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["/api/admin/events"],
    queryFn: async () => {
      const res = await fetch("/api/admin/events", { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const createEvent = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Event created" });
      setOpen(false);
      setForm({ title: "", description: "", date: "", time: "", location: "", locationDetail: "", maxSpots: 25, isActive: true });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Event deleted" });
    },
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Events ({events.length})</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-xl">
              <Plus className="w-4 h-4 mr-1" /> New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
              <DialogDescription>Fill in the details for the new event.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => { e.preventDefault(); createEvent.mutate(); }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Input value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} placeholder="Saturday, March 15" required />
                </div>
                <div className="space-y-2">
                  <Label>Time *</Label>
                  <Input value={form.time} onChange={(e) => setForm(f => ({ ...f, time: e.target.value }))} placeholder="10:00 AM – 12:00 PM" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location *</Label>
                <Input value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Location Detail</Label>
                <Input value={form.locationDetail} onChange={(e) => setForm(f => ({ ...f, locationDetail: e.target.value }))} placeholder="Floor, room, etc." />
              </div>
              <div className="space-y-2">
                <Label>Max Spots</Label>
                <Input type="number" value={form.maxSpots} onChange={(e) => setForm(f => ({ ...f, maxSpots: parseInt(e.target.value) || 25 }))} />
              </div>
              <Button type="submit" className="w-full" disabled={createEvent.isPending}>
                {createEvent.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Event"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No events yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="hidden sm:table-cell">Location</TableHead>
                <TableHead className="hidden sm:table-cell">Spots</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((ev: any) => (
                <TableRow key={ev.id}>
                  <TableCell className="font-medium">{ev.title}</TableCell>
                  <TableCell>{ev.date}</TableCell>
                  <TableCell className="hidden sm:table-cell">{ev.location}</TableCell>
                  <TableCell className="hidden sm:table-cell">{ev.maxSpots}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-600"
                      onClick={() => deleteEvent.mutate(ev.id)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// ─── RSVPs Tab ─────────────────────────────────────────────────

function RsvpsTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: rsvps = [], isLoading } = useQuery({
    queryKey: ["/api/admin/rsvps"],
    queryFn: async () => {
      const res = await fetch("/api/admin/rsvps", { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const deleteRsvp = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/rsvps/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rsvps"] });
      toast({ title: "RSVP deleted" });
    },
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">RSVPs ({rsvps.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {rsvps.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No RSVPs yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden sm:table-cell">Phone</TableHead>
                <TableHead className="hidden md:table-cell">Event ID</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rsvps.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.fullName}</TableCell>
                  <TableCell>{r.email}</TableCell>
                  <TableCell className="hidden sm:table-cell">{r.phone || "—"}</TableCell>
                  <TableCell className="hidden md:table-cell">{r.eventId}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-600"
                      onClick={() => deleteRsvp.mutate(r.id)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Messages Tab ──────────────────────────────────────────────

function MessagesTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["/api/admin/contacts"],
    queryFn: async () => {
      const res = await fetch("/api/admin/contacts", { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const deleteMsg = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      toast({ title: "Message deleted" });
    },
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Contact Messages ({messages.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No messages yet.</p>
        ) : (
          <div className="space-y-4">
            {messages.map((m: any) => (
              <div key={m.id} className="border rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold">{m.name}</span>
                    <span className="text-muted-foreground text-sm ml-2">{m.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-600"
                      onClick={() => deleteMsg.mutate(m.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-foreground/80">{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Users Tab (admin only) ────────────────────────────────────

function UsersTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: usersList = [], isLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Role updated" });
    },
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Users ({usersList.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {usersList.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No users yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Change Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersList.map((u: any) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.username}</TableCell>
                  <TableCell><RoleBadge role={u.role} /></TableCell>
                  <TableCell>
                    <Select
                      value={u.role}
                      onValueChange={(role) => updateRole.mutate({ id: u.id, role })}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="trainer">Trainer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Email Campaigns Tab (admin only) ─────────────────────────

function EmailTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ subject: "", body: "", audience: "all" });

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ["/api/admin/campaigns"],
    queryFn: async () => {
      const res = await fetch("/api/admin/campaigns", { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const createCampaign = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/campaigns"] });
      toast({ title: "Campaign created" });
      setOpen(false);
      setForm({ subject: "", body: "", audience: "all" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const sendCampaign = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/campaigns/${id}/send`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/campaigns"] });
      toast({ title: "Campaign sent", description: data.message });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Email Campaigns ({campaigns.length})</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-xl">
              <Plus className="w-4 h-4 mr-1" /> New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Email Campaign</DialogTitle>
              <DialogDescription>Compose a newsletter or announcement to send to your audience.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => { e.preventDefault(); createCampaign.mutate(); }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Input
                  value={form.subject}
                  onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))}
                  placeholder="Weekly Update - Horizonte Cafe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Audience</Label>
                <Select value={form.audience} onValueChange={(v) => setForm(f => ({ ...f, audience: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All contacts</SelectItem>
                    <SelectItem value="approved">Approved applicants</SelectItem>
                    <SelectItem value="track:a1-beginner">A1 Beginner</SelectItem>
                    <SelectItem value="track:a2-elementary">A2 Elementary</SelectItem>
                    <SelectItem value="track:intermediate">Intermediate</SelectItem>
                    <SelectItem value="track:advanced">Advanced</SelectItem>
                    <SelectItem value="events">Event RSVPs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Body (HTML supported) *</Label>
                <Textarea
                  value={form.body}
                  onChange={(e) => setForm(f => ({ ...f, body: e.target.value }))}
                  placeholder="<h2>Hello!</h2><p>Here's what's happening this week...</p>"
                  rows={8}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={createCampaign.isPending}>
                {createCampaign.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Draft"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {campaigns.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No campaigns yet. Create your first one!</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Sent</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{c.subject}</TableCell>
                  <TableCell><Badge variant="outline">{c.audience}</Badge></TableCell>
                  <TableCell>
                    <Badge className={c.status === "sent" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{c.sentCount || 0}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {c.status === "draft" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 gap-1 text-blue-600"
                        onClick={() => sendCampaign.mutate(c.id)}
                        disabled={sendCampaign.isPending}
                        title="Send campaign"
                      >
                        <Send className="w-4 h-4" /> Send
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Admin Dashboard ──────────────────────────────────────

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <Shield className="w-16 h-16 text-muted-foreground" />
          <h2 className="text-2xl font-heading font-bold">Sign In Required</h2>
          <p className="text-muted-foreground">You need to sign in to access the admin dashboard.</p>
          <Link href="/auth">
            <Button className="rounded-xl">
              <LogIn className="w-4 h-4 mr-2" /> Sign In
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (user.role !== "admin" && user.role !== "trainer") {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <Shield className="w-16 h-16 text-red-400" />
          <h2 className="text-2xl font-heading font-bold">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
          <Link href="/">
            <Button variant="outline" className="rounded-xl">Go Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const isAdmin = user.role === "admin";

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6" />
            <span className="text-sm font-bold text-white/70 uppercase tracking-wider">
              {isAdmin ? "Admin" : "Trainer"} Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black tracking-tight">
            Dashboard
          </h1>
          <p className="text-white/60 mt-1">Manage applications, events, RSVPs, messages{isAdmin ? ", and users" : ""}.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-10">
        <Tabs defaultValue="applications">
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="applications" className="gap-1.5">
              <FileText className="w-4 h-4" /> Applications
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-1.5">
              <CalendarDays className="w-4 h-4" /> Events
            </TabsTrigger>
            <TabsTrigger value="rsvps" className="gap-1.5">
              <Clock className="w-4 h-4" /> RSVPs
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-1.5">
              <Mail className="w-4 h-4" /> Messages
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="email" className="gap-1.5">
                <Send className="w-4 h-4" /> Email
              </TabsTrigger>
            )}
            {isAdmin && (
              <TabsTrigger value="users" className="gap-1.5">
                <Users className="w-4 h-4" /> Users
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="applications"><ApplicationsTab /></TabsContent>
          <TabsContent value="events"><EventsTab /></TabsContent>
          <TabsContent value="rsvps"><RsvpsTab /></TabsContent>
          <TabsContent value="messages"><MessagesTab /></TabsContent>
          {isAdmin && <TabsContent value="email"><EmailTab /></TabsContent>}
          {isAdmin && <TabsContent value="users"><UsersTab /></TabsContent>}
        </Tabs>
      </div>
    </Layout>
  );
}
