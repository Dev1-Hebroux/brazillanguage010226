import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { tracks, getTrackById } from "@/data/curriculum";
import {
  Shield, LogIn, Loader2, Users, CalendarDays, Mail, FileText,
  Trash2, CheckCircle, XCircle, Plus, Clock, Send, LayoutDashboard,
  GraduationCap, BookOpen, Settings, Menu, ChevronRight, Download,
  Search, Filter, Eye, UserPlus, ExternalLink, MessageSquare,
  MailOpen, AlertCircle, TrendingUp, ClipboardList, MapPin, X
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  };
  return <Badge variant="outline" className={map[status] ?? "bg-gray-100 text-gray-800"}>{status}</Badge>;
}

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    admin: "bg-purple-100 text-purple-800 border-purple-200",
    trainer: "bg-blue-100 text-blue-800 border-blue-200",
    student: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };
  return <Badge variant="outline" className={map[role] ?? "bg-gray-100 text-gray-800"}>{role}</Badge>;
}

function timeAgo(date: string | Date): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

function InitialsAvatar({ name, className = "" }: { name: string; className?: string }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className={`flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm ${className}`}>
      {initials}
    </div>
  );
}

const TRACK_LABELS: Record<string, string> = {
  "a1-beginner": "A1 Beginner",
  "a2-elementary": "A2 Elementary",
  "intermediate": "Intermediate",
  "advanced": "Advanced",
};

// ─── API fetch helper ─────────────────────────────────────────

async function apiFetch(url: string, opts?: RequestInit) {
  const res = await fetch(url, { credentials: "include", ...opts });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(data.message || "Request failed");
  }
  return res;
}

async function apiJson(url: string, opts?: RequestInit) {
  const res = await apiFetch(url, opts);
  return res.json();
}

// ═══════════════════════════════════════════════════════════════
// SECTION: Overview
// ═══════════════════════════════════════════════════════════════

function OverviewSection({ onNavigate }: { onNavigate: (section: string) => void }) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: () => apiJson("/api/admin/stats"),
  });

  if (isLoading) return <LoadingSkeleton />;

  const kpis = [
    { label: "Applications", value: stats?.applications?.total || 0, sub: `${stats?.applications?.pending || 0} pending`, icon: ClipboardList, color: "text-blue-600 bg-blue-50" },
    { label: "Students", value: stats?.students?.total || 0, sub: "enrolled", icon: GraduationCap, color: "text-green-600 bg-green-50" },
    { label: "Events", value: stats?.events?.total || 0, sub: `${stats?.events?.totalRsvps || 0} RSVPs`, icon: CalendarDays, color: "text-purple-600 bg-purple-50" },
    { label: "Messages", value: stats?.messages?.total || 0, sub: `${stats?.messages?.unread || 0} unread`, icon: MessageSquare, color: "text-orange-600 bg-orange-50" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{kpi.label}</p>
                  <p className="text-3xl font-bold mt-1">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.color}`}>
                  <kpi.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => onNavigate("applications")}>
              <ClipboardList className="w-4 h-4" /> Review Applications
              {(stats?.applications?.pending || 0) > 0 && (
                <Badge className="bg-yellow-100 text-yellow-800 ml-1">{stats.applications.pending}</Badge>
              )}
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => onNavigate("events")}>
              <Plus className="w-4 h-4" /> Create Event
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => onNavigate("communications")}>
              <Send className="w-4 h-4" /> Send Campaign
            </Button>
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <a href="/api/admin/applications/export" download>
                <Download className="w-4 h-4" /> Export Data
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enrollment by Track */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Enrollment by Track</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(TRACK_LABELS).map(([trackId, label]) => (
              <div key={trackId} className="text-center p-4 rounded-xl bg-gray-50">
                <p className="text-2xl font-bold">{stats?.students?.byTrack?.[trackId] || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Application Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["pending", "approved", "rejected"].map(status => {
              const val = stats?.applications?.[status] || 0;
              const total = stats?.applications?.total || 1;
              const colors: Record<string, string> = { pending: "bg-yellow-500", approved: "bg-green-500", rejected: "bg-red-400" };
              return (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{status}</span>
                    <span className="font-medium">{val}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${colors[status]} rounded-full transition-all`} style={{ width: `${(val / total) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Email Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats?.emailsSent || 0}</p>
                <p className="text-sm text-muted-foreground">emails sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: Applications
// ═══════════════════════════════════════════════════════════════

function ApplicationsSection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [sendEmail, setSendEmail] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [trackFilter, setTrackFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["/api/admin/applications"],
    queryFn: () => apiJson("/api/admin/applications"),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiJson(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, sendEmail }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Status updated" });
    },
  });

  const deleteApp = useMutation({
    mutationFn: async (id: number) => {
      await apiFetch(`/api/admin/applications/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Application deleted" });
    },
  });

  const bulkAction = useMutation({
    mutationFn: async (action: string) => {
      return apiJson("/api/admin/applications/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds), action }),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: data.message });
      setSelectedIds(new Set());
    },
  });

  const filtered = useMemo(() => {
    return apps.filter((a: any) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (trackFilter !== "all" && a.trackId !== trackFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return a.fullName?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [apps, search, statusFilter, trackFilter]);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((a: any) => a.id)));
    }
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <>
      <div className="space-y-4">
        {/* Header with controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Applications</h2>
            <p className="text-sm text-muted-foreground">Showing {filtered.length} of {apps.length} applications</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Checkbox id="send-email" checked={sendEmail} onCheckedChange={(c) => setSendEmail(c === true)} />
              <Label htmlFor="send-email" className="text-xs text-muted-foreground cursor-pointer whitespace-nowrap">
                Email on approve/reject
              </Label>
            </div>
            <Button variant="outline" size="sm" className="gap-1" asChild>
              <a href="/api/admin/applications/export" download>
                <Download className="w-3.5 h-3.5" /> CSV
              </a>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={trackFilter} onValueChange={setTrackFilter}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Track" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tracks</SelectItem>
              {Object.entries(TRACK_LABELS).map(([id, label]) => (
                <SelectItem key={id} value={id}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bulk actions */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
            <span className="text-sm font-medium">{selectedIds.size} selected</span>
            <Button size="sm" variant="outline" className="gap-1 text-green-700 border-green-200 bg-green-50" onClick={() => bulkAction.mutate("approved")}>
              <CheckCircle className="w-3.5 h-3.5" /> Approve All
            </Button>
            <Button size="sm" variant="outline" className="gap-1 text-red-700 border-red-200 bg-red-50" onClick={() => bulkAction.mutate("rejected")}>
              <XCircle className="w-3.5 h-3.5" /> Reject All
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>Clear</Button>
          </div>
        )}

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <EmptyState icon={ClipboardList} title="No applications found" description="Applications will appear here when students apply." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox checked={selectedIds.size === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} />
                    </TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Track</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((app: any) => (
                    <TableRow key={app.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedApp(app)}>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={selectedIds.has(app.id)} onCheckedChange={() => toggleSelect(app.id)} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <InitialsAvatar name={app.fullName} className="w-8 h-8 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium truncate">{app.fullName}</p>
                            <p className="text-xs text-muted-foreground truncate">{app.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{TRACK_LABELS[app.trackId] || app.trackId}</Badge></TableCell>
                      <TableCell><StatusBadge status={app.status} /></TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{timeAgo(app.createdAt)}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600" onClick={() => updateStatus.mutate({ id: app.id, status: "approved" })} title="Approve">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600" onClick={() => updateStatus.mutate({ id: app.id, status: "rejected" })} title="Reject">
                            <XCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground" onClick={() => deleteApp.mutate(app.id)} title="Delete">
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
      </div>

      {/* Detail Drawer */}
      <Sheet open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Application Details</SheetTitle>
          </SheetHeader>
          {selectedApp && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <InitialsAvatar name={selectedApp.fullName} className="w-14 h-14 text-lg" />
                <div>
                  <h3 className="font-bold text-lg">{selectedApp.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedApp.email}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{selectedApp.phone || "—"}</p></div>
                <div><p className="text-muted-foreground">Track</p><p className="font-medium">{TRACK_LABELS[selectedApp.trackId] || selectedApp.trackId}</p></div>
                <div><p className="text-muted-foreground">English Level</p><p className="font-medium">{selectedApp.englishLevel}</p></div>
                <div><p className="text-muted-foreground">Status</p><StatusBadge status={selectedApp.status} /></div>
                <div className="col-span-2"><p className="text-muted-foreground">Applied</p><p className="font-medium">{new Date(selectedApp.createdAt).toLocaleDateString()}</p></div>
              </div>
              {selectedApp.motivation && (
                <>
                  <Separator />
                  <div><p className="text-sm text-muted-foreground mb-1">Motivation</p><p className="text-sm">{selectedApp.motivation}</p></div>
                </>
              )}
              <Separator />
              <div className="flex gap-2">
                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => { updateStatus.mutate({ id: selectedApp.id, status: "approved" }); setSelectedApp(null); }}>
                  <CheckCircle className="w-4 h-4 mr-2" /> Approve
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => { updateStatus.mutate({ id: selectedApp.id, status: "rejected" }); setSelectedApp(null); }}>
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: Students
// ═══════════════════════════════════════════════════════════════

function StudentsSection() {
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState("all");

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["/api/admin/applications"],
    queryFn: () => apiJson("/api/admin/applications"),
  });

  const students = useMemo(() => {
    return apps.filter((a: any) => {
      if (a.status !== "approved") return false;
      if (trackFilter !== "all" && a.trackId !== trackFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return a.fullName?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [apps, search, trackFilter]);

  const allStudents = apps.filter((a: any) => a.status === "approved");

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Students</h2>
          <p className="text-sm text-muted-foreground">{allStudents.length} enrolled students</p>
        </div>
      </div>

      {/* Track summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(TRACK_LABELS).map(([id, label]) => {
          const count = allStudents.filter((s: any) => s.trackId === id).length;
          return (
            <Card key={id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTrackFilter(id === trackFilter ? "all" : id)}>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={trackFilter} onValueChange={setTrackFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Track" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tracks</SelectItem>
            {Object.entries(TRACK_LABELS).map(([id, label]) => (
              <SelectItem key={id} value={id}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Student cards */}
      {students.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No students found" description="Students will appear here when applications are approved." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((s: any) => (
            <Card key={s.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <InitialsAvatar name={s.fullName} className="w-10 h-10" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{s.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <Badge variant="outline" className="text-xs">{TRACK_LABELS[s.trackId] || s.trackId}</Badge>
                  <span className="text-xs text-muted-foreground">{timeAgo(s.createdAt)}</span>
                </div>
                {s.phone && <p className="text-xs text-muted-foreground mt-2">{s.phone}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: Cohorts
// ═══════════════════════════════════════════════════════════════

function CohortsSection({ onNavigate }: { onNavigate: (section: string) => void }) {
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: () => apiJson("/api/admin/stats"),
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Cohorts & Tracks</h2>
        <p className="text-sm text-muted-foreground">4 tracks with 8-week curriculum each</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tracks.map((track) => {
          const enrolled = stats?.students?.byTrack?.[track.id] || 0;
          const pending = (stats?.applications?.total || 0) > 0 ? "—" : "0";
          return (
            <Card key={track.id} className="overflow-hidden">
              <div className={`h-2`} style={{ backgroundColor: track.color }} />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{track.title}</CardTitle>
                    <CardDescription>{track.cefrLevel} — {track.duration}</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs" style={{ borderColor: track.color, color: track.color }}>{track.level}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-4 text-sm">
                  <div><span className="text-muted-foreground">Enrolled:</span> <span className="font-bold">{enrolled}</span></div>
                  <div><span className="text-muted-foreground">Schedule:</span> <span className="font-medium">{track.schedule}</span></div>
                </div>

                <Accordion type="single" collapsible>
                  <AccordionItem value="curriculum" className="border-none">
                    <AccordionTrigger className="text-sm py-2 hover:no-underline">
                      <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> View Curriculum ({track.weeks.length} weeks)</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {track.weeks.map((w) => (
                          <div key={w.week} className="flex items-start gap-3 py-2 border-b last:border-0">
                            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-xs font-bold">{w.week}</div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium">{w.title}</p>
                              {w.communicativeGoal && <p className="text-xs text-muted-foreground mt-0.5">{w.communicativeGoal}</p>}
                              <div className="flex flex-wrap gap-1 mt-1">
                                {w.languageFocus.slice(0, 3).map(f => (
                                  <Badge key={f} variant="secondary" className="text-[10px] px-1.5 py-0">{f}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => onNavigate("students")}>
                  <Users className="w-3.5 h-3.5" /> View Students
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: Events
// ═══════════════════════════════════════════════════════════════

function EventsSection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [rsvpEventId, setRsvpEventId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", description: "", date: "", time: "", location: "", locationDetail: "", maxSpots: 25, isActive: true });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["/api/admin/events"],
    queryFn: () => apiJson("/api/admin/events"),
  });

  const { data: rsvps = [] } = useQuery({
    queryKey: ["/api/admin/rsvps"],
    queryFn: () => apiJson("/api/admin/rsvps"),
  });

  const rsvpCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    rsvps.forEach((r: any) => { counts[r.eventId] = (counts[r.eventId] || 0) + 1; });
    return counts;
  }, [rsvps]);

  const createEvent = useMutation({
    mutationFn: () => apiJson("/api/admin/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Event created" });
      setCreateOpen(false);
      resetForm();
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateEvent = useMutation({
    mutationFn: () => apiJson(`/api/admin/events/${editId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      toast({ title: "Event updated" });
      setEditId(null);
      resetForm();
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: number) => { await apiFetch(`/api/admin/events/${id}`, { method: "DELETE" }); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Event deleted" });
    },
  });

  const deleteRsvp = useMutation({
    mutationFn: async (id: number) => { await apiFetch(`/api/admin/rsvps/${id}`, { method: "DELETE" }); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rsvps"] });
      toast({ title: "RSVP deleted" });
    },
  });

  function resetForm() {
    setForm({ title: "", description: "", date: "", time: "", location: "", locationDetail: "", maxSpots: 25, isActive: true });
  }

  function openEdit(ev: any) {
    setForm({ title: ev.title, description: ev.description || "", date: ev.date, time: ev.time, location: ev.location, locationDetail: ev.locationDetail || "", maxSpots: ev.maxSpots || 25, isActive: ev.isActive ?? true });
    setEditId(ev.id);
  }

  if (isLoading) return <LoadingSkeleton />;

  const eventRsvpList = rsvpEventId ? rsvps.filter((r: any) => r.eventId === rsvpEventId) : [];

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Events</h2>
            <p className="text-sm text-muted-foreground">{events.length} events</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> New Event</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Event</DialogTitle>
                <DialogDescription>Fill in the details for the new event.</DialogDescription>
              </DialogHeader>
              <EventForm form={form} setForm={setForm} onSubmit={() => createEvent.mutate()} isPending={createEvent.isPending} buttonLabel="Create Event" />
            </DialogContent>
          </Dialog>
        </div>

        {events.length === 0 ? (
          <EmptyState icon={CalendarDays} title="No events yet" description="Create your first event to get started." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((ev: any) => {
              const count = rsvpCounts[ev.id] || 0;
              const max = ev.maxSpots || 25;
              const pct = Math.min((count / max) * 100, 100);
              return (
                <Card key={ev.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{ev.title}</h3>
                        {ev.description && <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{ev.description}</p>}
                      </div>
                      <Badge variant={ev.isActive ? "default" : "secondary"}>{ev.isActive ? "Active" : "Inactive"}</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="w-4 h-4" /> {ev.date} — {ev.time}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" /> {ev.location}{ev.locationDetail ? ` (${ev.locationDetail})` : ""}
                      </div>
                      <div className="pt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{count} / {max} RSVPs</span>
                          <span>{Math.round(pct)}%</span>
                        </div>
                        <Progress value={pct} className="h-2" />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="gap-1 flex-1" onClick={() => setRsvpEventId(ev.id)}>
                        <Eye className="w-3.5 h-3.5" /> RSVPs ({count})
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => openEdit(ev)}>Edit</Button>
                      <Button size="sm" variant="ghost" className="text-red-600 h-8 w-8 p-0" onClick={() => deleteEvent.mutate(ev.id)} title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editId !== null} onOpenChange={(open) => { if (!open) { setEditId(null); resetForm(); } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Update the event details.</DialogDescription>
          </DialogHeader>
          <EventForm form={form} setForm={setForm} onSubmit={() => updateEvent.mutate()} isPending={updateEvent.isPending} buttonLabel="Update Event" />
        </DialogContent>
      </Dialog>

      {/* RSVP Sheet */}
      <Sheet open={rsvpEventId !== null} onOpenChange={(open) => !open && setRsvpEventId(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>RSVPs ({eventRsvpList.length})</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-2">
            {rsvpEventId && (
              <Button size="sm" variant="outline" className="gap-1 mb-3" asChild>
                <a href={`/api/admin/events/${rsvpEventId}/export`} download><Download className="w-3.5 h-3.5" /> Export CSV</a>
              </Button>
            )}
            {eventRsvpList.length === 0 ? (
              <p className="text-muted-foreground text-center py-8 text-sm">No RSVPs for this event.</p>
            ) : (
              eventRsvpList.map((r: any) => (
                <div key={r.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <InitialsAvatar name={r.fullName} className="w-8 h-8" />
                    <div>
                      <p className="text-sm font-medium">{r.fullName}</p>
                      <p className="text-xs text-muted-foreground">{r.email}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600" onClick={() => deleteRsvp.mutate(r.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function EventForm({ form, setForm, onSubmit, isPending, buttonLabel }: any) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
      <div className="space-y-2">
        <Label>Title *</Label>
        <Input value={form.title} onChange={(e) => setForm((f: any) => ({ ...f, title: e.target.value }))} required />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={form.description} onChange={(e) => setForm((f: any) => ({ ...f, description: e.target.value }))} rows={2} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date *</Label>
          <Input value={form.date} onChange={(e) => setForm((f: any) => ({ ...f, date: e.target.value }))} placeholder="Saturday, March 15" required />
        </div>
        <div className="space-y-2">
          <Label>Time *</Label>
          <Input value={form.time} onChange={(e) => setForm((f: any) => ({ ...f, time: e.target.value }))} placeholder="10:00 AM – 12:00 PM" required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Location *</Label>
          <Input value={form.location} onChange={(e) => setForm((f: any) => ({ ...f, location: e.target.value }))} required />
        </div>
        <div className="space-y-2">
          <Label>Max Spots</Label>
          <Input type="number" value={form.maxSpots} onChange={(e) => setForm((f: any) => ({ ...f, maxSpots: parseInt(e.target.value) || 25 }))} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={form.isActive} onCheckedChange={(c) => setForm((f: any) => ({ ...f, isActive: c }))} />
        <Label>Active</Label>
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : buttonLabel}
      </Button>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: Communications
// ═══════════════════════════════════════════════════════════════

function CommunicationsSection() {
  const isAdmin = useAuth().user?.role === "admin";

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Communications</h2>
      <Tabs defaultValue="inbox">
        <TabsList>
          <TabsTrigger value="inbox" className="gap-1.5"><MessageSquare className="w-4 h-4" /> Inbox</TabsTrigger>
          {isAdmin && <TabsTrigger value="campaigns" className="gap-1.5"><Send className="w-4 h-4" /> Campaigns</TabsTrigger>}
          {isAdmin && <TabsTrigger value="log" className="gap-1.5"><Mail className="w-4 h-4" /> Email Log</TabsTrigger>}
        </TabsList>
        <TabsContent value="inbox"><InboxTab /></TabsContent>
        {isAdmin && <TabsContent value="campaigns"><CampaignsTab /></TabsContent>}
        {isAdmin && <TabsContent value="log"><EmailLogTab /></TabsContent>}
      </Tabs>
    </div>
  );
}

function InboxTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["/api/admin/contacts"],
    queryFn: () => apiJson("/api/admin/contacts"),
  });

  const markRead = useMutation({
    mutationFn: (id: number) => apiJson(`/api/admin/contacts/${id}/read`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
  });

  const deleteMsg = useMutation({
    mutationFn: async (id: number) => { await apiFetch(`/api/admin/contacts/${id}`, { method: "DELETE" }); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Message deleted" });
    },
  });

  if (isLoading) return <LoadingSkeleton />;

  const filtered = messages.filter((m: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q) || m.message?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-3 mt-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search messages..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No messages" description="Contact messages will appear here." />
      ) : (
        filtered.map((m: any) => (
          <Card key={m.id} className={`transition-all ${!m.isRead ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""}`}
            onClick={() => !m.isRead && markRead.mutate(m.id)}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <InitialsAvatar name={m.name} className="w-9 h-9" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium text-sm ${!m.isRead ? "font-bold" : ""}`}>{m.name}</span>
                      {!m.isRead && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                    </div>
                    <span className="text-xs text-muted-foreground">{m.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">{timeAgo(m.createdAt)}</span>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-600" onClick={(e) => { e.stopPropagation(); deleteMsg.mutate(m.id); }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-foreground/80 mt-2 line-clamp-3">{m.message}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

function CampaignsTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ subject: "", body: "", audience: "all" });

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ["/api/admin/campaigns"],
    queryFn: () => apiJson("/api/admin/campaigns"),
  });

  const createCampaign = useMutation({
    mutationFn: () => apiJson("/api/admin/campaigns", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/campaigns"] });
      toast({ title: "Campaign created" });
      setOpen(false);
      setForm({ subject: "", body: "", audience: "all" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const sendCampaign = useMutation({
    mutationFn: (id: number) => apiJson(`/api/admin/campaigns/${id}/send`, { method: "POST" }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/campaigns"] });
      toast({ title: "Campaign sent", description: data.message });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-3 mt-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> New Campaign</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Email Campaign</DialogTitle>
              <DialogDescription>Compose a newsletter or announcement.</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); createCampaign.mutate(); }} className="space-y-4">
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Input value={form.subject} onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Weekly Update" required />
              </div>
              <div className="space-y-2">
                <Label>Audience</Label>
                <Select value={form.audience} onValueChange={(v) => setForm(f => ({ ...f, audience: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
                <Textarea value={form.body} onChange={(e) => setForm(f => ({ ...f, body: e.target.value }))} rows={6} required />
              </div>
              <Button type="submit" className="w-full" disabled={createCampaign.isPending}>
                {createCampaign.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Draft"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {campaigns.length === 0 ? (
        <EmptyState icon={Send} title="No campaigns" description="Create your first email campaign." />
      ) : (
        campaigns.map((c: any) => (
          <Card key={c.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="font-medium truncate">{c.subject}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{c.audience}</Badge>
                    <Badge className={c.status === "sent" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"} variant="outline">{c.status}</Badge>
                    {c.sentCount > 0 && <span className="text-xs text-muted-foreground">{c.sentCount} sent</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{timeAgo(c.createdAt)}</span>
                  {c.status === "draft" && (
                    <Button size="sm" className="gap-1" onClick={() => sendCampaign.mutate(c.id)} disabled={sendCampaign.isPending}>
                      <Send className="w-3.5 h-3.5" /> Send
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

function EmailLogTab() {
  const { data: log = [], isLoading } = useQuery({
    queryKey: ["/api/admin/email-log"],
    queryFn: () => apiJson("/api/admin/email-log"),
  });

  const [statusFilter, setStatusFilter] = useState("all");

  if (isLoading) return <LoadingSkeleton />;

  const filtered = statusFilter === "all" ? log : log.filter((e: any) => e.status === statusFilter);

  const statusColors: Record<string, string> = {
    sent: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-3 mt-4">
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="sent">Sent</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>

      {filtered.length === 0 ? (
        <EmptyState icon={Mail} title="No emails" description="Email delivery log will appear here." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>To</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.slice(0, 50).map((e: any) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-sm max-w-[180px] truncate">{e.to}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">{e.subject}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[e.status] || ""}>{e.status}</Badge>
                      {e.errorMessage && (
                        <span className="text-xs text-red-500 block mt-0.5 truncate max-w-[150px]">{e.errorMessage}</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{timeAgo(e.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: Users
// ═══════════════════════════════════════════════════════════════

function UsersSection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ username: "", password: "", role: "student" });

  const { data: usersList = [], isLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    queryFn: () => apiJson("/api/admin/users"),
  });

  const updateRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      apiJson(`/api/admin/users/${id}/role`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Role updated" });
    },
  });

  const createUser = useMutation({
    mutationFn: () =>
      apiJson("/api/admin/users/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(inviteForm) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User created" });
      setInviteOpen(false);
      setInviteForm({ username: "", password: "", role: "student" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Users</h2>
          <p className="text-sm text-muted-foreground">{usersList.length} accounts</p>
        </div>
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2"><UserPlus className="w-4 h-4" /> Invite User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite User</DialogTitle>
              <DialogDescription>Create a new user account.</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); createUser.mutate(); }} className="space-y-4">
              <div className="space-y-2">
                <Label>Username *</Label>
                <Input value={inviteForm.username} onChange={(e) => setInviteForm(f => ({ ...f, username: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Password *</Label>
                <Input type="password" value={inviteForm.password} onChange={(e) => setInviteForm(f => ({ ...f, password: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={inviteForm.role} onValueChange={(v) => setInviteForm(f => ({ ...f, role: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="trainer">Trainer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={createUser.isPending}>
                {createUser.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create User"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {usersList.length === 0 ? (
        <EmptyState icon={Users} title="No users" description="User accounts will appear here." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {usersList.map((u: any) => (
            <Card key={u.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <InitialsAvatar name={u.username} className="w-10 h-10" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{u.username}</p>
                    <RoleBadge role={u.role} />
                  </div>
                </div>
                <Select value={u.role} onValueChange={(role) => updateRole.mutate({ id: u.id, role })}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="trainer">Trainer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: Google Forms
// ═══════════════════════════════════════════════════════════════

function GoogleFormsSection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", formUrl: "", sheetCsvUrl: "", linkedTo: "general", linkedId: "" });

  const { data: forms = [], isLoading } = useQuery({
    queryKey: ["/api/admin/google-forms"],
    queryFn: () => apiJson("/api/admin/google-forms"),
  });

  const createForm = useMutation({
    mutationFn: () => apiJson("/api/admin/google-forms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/google-forms"] });
      toast({ title: "Google Form linked" });
      setOpen(false);
      setForm({ title: "", formUrl: "", sheetCsvUrl: "", linkedTo: "general", linkedId: "" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteForm = useMutation({
    mutationFn: async (id: number) => { await apiFetch(`/api/admin/google-forms/${id}`, { method: "DELETE" }); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/google-forms"] });
      toast({ title: "Form link removed" });
    },
  });

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Google Forms</h2>
          <p className="text-sm text-muted-foreground">Link external forms for applications, surveys, and feedback</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Link Form</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Link Google Form</DialogTitle>
              <DialogDescription>Connect a Google Form to your platform.</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); createForm.mutate(); }} className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Placement Test" required />
              </div>
              <div className="space-y-2">
                <Label>Google Form URL *</Label>
                <Input value={form.formUrl} onChange={(e) => setForm(f => ({ ...f, formUrl: e.target.value }))} placeholder="https://docs.google.com/forms/d/..." required />
              </div>
              <div className="space-y-2">
                <Label>Google Sheet CSV URL (optional)</Label>
                <Input value={form.sheetCsvUrl} onChange={(e) => setForm(f => ({ ...f, sheetCsvUrl: e.target.value }))} placeholder="Published sheet CSV URL for importing responses" />
              </div>
              <div className="space-y-2">
                <Label>Linked To</Label>
                <Select value={form.linkedTo} onValueChange={(v) => setForm(f => ({ ...f, linkedTo: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="cohort">Cohort</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={createForm.isPending}>
                {createForm.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Link Form"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {forms.length === 0 ? (
        <EmptyState icon={ExternalLink} title="No forms linked" description="Link a Google Form to collect external responses." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forms.map((f: any) => (
            <Card key={f.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <h3 className="font-medium">{f.title}</h3>
                    <Badge variant="outline" className="text-xs mt-1">{f.linkedTo}</Badge>
                    <p className="text-xs text-muted-foreground mt-2 truncate">{f.formUrl}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                      <a href={f.formUrl} target="_blank" rel="noopener noreferrer" title="Open Form">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600" onClick={() => deleteForm.mutate(f.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: Settings Placeholder
// ═══════════════════════════════════════════════════════════════

function SettingsSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Settings</h2>
      <Card>
        <CardContent className="p-8 text-center">
          <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">Platform Settings</h3>
          <p className="text-muted-foreground mt-2">Configuration options will be added here in future updates.</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Shared Components
// ═══════════════════════════════════════════════════════════════

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-medium text-lg">{title}</h3>
      <p className="text-muted-foreground text-sm mt-1 max-w-sm">{description}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN: Admin Dashboard with Sidebar Navigation
// ═══════════════════════════════════════════════════════════════

type NavSection = "overview" | "applications" | "students" | "cohorts" | "events" | "communications" | "users" | "forms" | "settings";

const NAV_ITEMS: { id: NavSection; label: string; icon: any; adminOnly?: boolean }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "applications", label: "Applications", icon: ClipboardList },
  { id: "students", label: "Students", icon: GraduationCap },
  { id: "cohorts", label: "Cohorts", icon: BookOpen },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "communications", label: "Communications", icon: Mail },
  { id: "users", label: "Users", icon: Users, adminOnly: true },
  { id: "forms", label: "Google Forms", icon: ExternalLink },
  { id: "settings", label: "Settings", icon: Settings, adminOnly: true },
];

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState<NavSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <Button className="rounded-xl"><LogIn className="w-4 h-4 mr-2" /> Sign In</Button>
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
          <Link href="/"><Button variant="outline" className="rounded-xl">Go Home</Button></Link>
        </div>
      </Layout>
    );
  }

  const isAdmin = user.role === "admin";
  const visibleNav = NAV_ITEMS.filter(item => !item.adminOnly || isAdmin);

  function navigate(section: NavSection) {
    setActiveSection(section);
    setSidebarOpen(false);
  }

  function renderSection() {
    switch (activeSection) {
      case "overview": return <OverviewSection onNavigate={(s) => navigate(s as NavSection)} />;
      case "applications": return <ApplicationsSection />;
      case "students": return <StudentsSection />;
      case "cohorts": return <CohortsSection onNavigate={(s) => navigate(s as NavSection)} />;
      case "events": return <EventsSection />;
      case "communications": return <CommunicationsSection />;
      case "users": return isAdmin ? <UsersSection /> : null;
      case "forms": return <GoogleFormsSection />;
      case "settings": return isAdmin ? <SettingsSection /> : null;
      default: return <OverviewSection onNavigate={(s) => navigate(s as NavSection)} />;
    }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">Horizonte Cafe</p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-1">
        {visibleNav.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <item.icon className={`w-4.5 h-4.5 ${isActive ? "text-blue-600" : ""}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <InitialsAvatar name={user.username} className="w-8 h-8" />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user.username}</p>
            <RoleBadge role={user.role} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 border-r bg-white flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-60 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 border-b bg-white flex items-center gap-4 px-4 shrink-0">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-medium capitalize">{activeSection}</span>
          </div>
        </header>

        {/* Content Area */}
        <ScrollArea className="flex-1">
          <main className="p-4 md:p-6 lg:p-8 max-w-7xl">
            {renderSection()}
          </main>
        </ScrollArea>
      </div>
    </div>
  );
}
