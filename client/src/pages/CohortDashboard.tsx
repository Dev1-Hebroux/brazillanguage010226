import { useState } from "react";
import { useParams, Link } from "wouter";
import Layout from "@/components/layout/Layout";
import { getTrackById, tracks, type Track } from "@/data/curriculum";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Mic, MessageCircle, Play, CheckCircle2, Lock, FileText, Clock, Trophy, Map,
  ChevronRight, ChevronLeft, Upload, GraduationCap, BookOpen, LogIn
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth";
import { whatsappLink } from "@/lib/config";

type SimulatedProgress = {
  currentWeek: number;
  completedWeeks: number[];
};

const SIM_PROGRESS: Record<string, SimulatedProgress> = {
  "a1-beginner": { currentWeek: 3, completedWeeks: [1, 2] },
  "a2-elementary": { currentWeek: 2, completedWeeks: [1] },
  intermediate: { currentWeek: 5, completedWeeks: [1, 2, 3, 4] },
  advanced: { currentWeek: 1, completedWeeks: [] },
};

function weekStatus(week: number, p: SimulatedProgress) {
  if (p.completedWeeks.includes(week)) return "completed" as const;
  if (week === p.currentWeek) return "current" as const;
  return "locked" as const;
}

// ─── LIST VIEW ───────────────────────────────────────────────

function CohortListView() {
  return (
    <Layout>
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary tracking-tight">My Cohorts</h1>
          <p className="text-muted-foreground font-medium mt-2 text-lg">
            Continue where you left off, or enter a cohort to see your weekly materials and submissions.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {tracks.map((t) => {
            const p = SIM_PROGRESS[t.id] ?? { currentWeek: 1, completedWeeks: [] };
            const progressPct = Math.round(((p.currentWeek - 1) / 8) * 100);
            const nextWeek = t.weeks.find((w) => w.week === p.currentWeek);
            return (
              <Card key={t.id} className="overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-none group">
                <CardHeader className="space-y-2 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-heading font-bold group-hover:text-primary transition-colors">{t.title}</CardTitle>
                    <Badge variant="secondary" className="font-bold">{t.cefrLevel}</Badge>
                  </div>
                  <CardDescription className="font-medium">{t.level} &bull; {t.duration}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-bold text-foreground">Progress</span>
                      <span className="text-muted-foreground font-medium">
                        Week {p.currentWeek} of 8
                      </span>
                    </div>
                    <Progress value={progressPct} className="h-2.5" />
                  </div>

                  {/* Next Up */}
                  <div className="rounded-xl border bg-muted/30 p-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Next up</div>
                    <div className="text-sm text-foreground font-medium">
                      {nextWeek
                        ? `Week ${nextWeek.week}: ${nextWeek.title} — ${nextWeek.task}`
                        : "No upcoming week found."}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link href={`/dashboard/${t.id}`} className="flex-1">
                      <Button className="w-full rounded-xl font-bold h-12 shadow-md">
                        Continue
                      </Button>
                    </Link>
                    <Link href={`/cohorts/${t.id}`}>
                      <Button variant="outline" className="rounded-xl font-bold h-12">
                        View Cohort
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

// ─── INSIDE VIEW ─────────────────────────────────────────────

function CohortInsideView({ track }: { track: Track }) {
  const progress = SIM_PROGRESS[track.id] ?? { currentWeek: 1, completedWeeks: [] };
  const [selectedWeek, setSelectedWeek] = useState(progress.currentWeek);

  const week = track.weeks.find((w) => w.week === selectedWeek) ?? track.weeks[0];
  const status = weekStatus(selectedWeek, progress);
  const progressPct = Math.round(((progress.currentWeek - 1) / 8) * 100);

  const curriculum = track.weeks.map((w) => ({
    week: w.week,
    title: w.title,
    status: weekStatus(w.week, progress),
  }));

  const CurriculumList = () => (
    <div className="divide-y divide-border">
      {curriculum.map((item) => {
        const clickable = item.status !== "locked";
        return (
          <button
            key={item.week}
            disabled={!clickable}
            onClick={() => clickable && setSelectedWeek(item.week)}
            className={cn(
              "w-full p-4 flex items-center gap-3 transition-colors text-left",
              selectedWeek === item.week
                ? "bg-primary/5 border-l-4 border-l-primary"
                : item.status === "locked"
                  ? "opacity-60"
                  : "hover:bg-muted/50 bg-transparent",
              clickable && "cursor-pointer"
            )}
          >
            <div className="shrink-0">
              {item.status === "completed" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {item.status === "current" && (
                <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
              )}
              {item.status === "locked" && <Lock className="w-4 h-4 text-muted-foreground" />}
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Week {item.week}</p>
              <p className={cn(
                "text-sm font-medium",
                selectedWeek === item.week ? "text-primary font-bold" : "text-foreground/80"
              )}>
                {item.title}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <Layout>
      {/* Header Bar */}
      <div className="bg-muted/30 border-b border-border md:sticky md:top-[72px] z-30 backdrop-blur-sm bg-white/80 supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors shrink-0">
                  <ChevronLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-lg sm:text-2xl md:text-3xl font-heading font-bold text-primary tracking-tight">
                  My Cohort: {track.title}
                </h1>
                <Badge className="shrink-0">{track.cefrLevel}</Badge>
              </div>
              <p className="text-muted-foreground font-medium flex items-center gap-2 text-xs sm:text-sm md:text-base pl-7 sm:pl-8">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></span>
                <span className="truncate">Week {selectedWeek} of 8 &bull; "{week.title}" &bull; {status}</span>
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-border shadow-sm ring-1 ring-black/5">
              <div className="text-right hidden sm:block shrink-0">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Overall Progress</p>
                <p className="text-sm font-bold text-primary">{progressPct}% Complete</p>
              </div>
              <Progress value={progressPct} className="w-full sm:w-32 h-2.5" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">

        {/* Mobile Curriculum Trigger */}
        <div className="lg:hidden mb-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full justify-between h-14 text-base font-bold shadow-sm border-2">
                <span className="flex items-center gap-2"><Map className="w-4 h-4 text-primary" /> View Curriculum Map</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 overflow-y-auto">
              <SheetHeader className="p-6 border-b bg-muted/10 text-left">
                <SheetTitle className="font-heading text-xl">Curriculum Map</SheetTitle>
              </SheetHeader>
              <CurriculumList />
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">

          {/* Desktop Sidebar */}
          <div className="hidden lg:block space-y-6 sticky top-32">
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden ring-1 ring-black/5">
              <div className="p-4 border-b border-border bg-muted/20">
                <h3 className="font-heading font-bold flex items-center gap-2">
                  <Map className="w-4 h-4 text-primary" /> Curriculum Map
                </h3>
              </div>
              <CurriculumList />
            </div>

            <div className="bg-accent/10 rounded-xl p-6 border border-accent/20">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5 text-accent-foreground" />
                <h3 className="font-heading font-bold text-accent-foreground">My Progress</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {progress.completedWeeks.length} of 8 weeks completed. Keep going!
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm items-center">
                  <span className="font-medium">Weeks Done</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5,6,7,8].map(s => (
                      <div key={s} className={`w-5 h-1.5 rounded-full transition-all ${s <= progress.completedWeeks.length ? 'bg-accent' : 'bg-accent/20'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8 min-w-0">

            {/* Current Week Panel */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm ring-1 ring-black/5 space-y-5">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Week {week.week}</Badge>
                    {week.assessment && week.assessment.length > 0 && (
                      <Badge className="bg-orange-100 text-orange-800 border-none">Assessment Week</Badge>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                    {week.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">{week.summary}</p>
                </div>
                <Link href={`/cohorts/${track.id}`}>
                  <Button variant="outline" className="shrink-0 rounded-full gap-2">
                    <BookOpen className="w-4 h-4" /> Full Syllabus
                  </Button>
                </Link>
              </div>

              {/* Communicative Goal */}
              {week.communicativeGoal && (
                <div className="rounded-xl border bg-blue-50/50 p-4">
                  <div className="font-bold text-sm text-blue-900 mb-1">Communicative Goal</div>
                  <div className="text-sm text-blue-800/80">{week.communicativeGoal}</div>
                </div>
              )}

              {/* Language Focus Tags */}
              <div>
                <div className="text-sm font-bold mb-2">Language Focus</div>
                <div className="flex flex-wrap gap-2">
                  {week.languageFocus.map((lf) => (
                    <Badge key={lf} variant="outline" className="font-medium">{lf}</Badge>
                  ))}
                </div>
              </div>

              {/* Task */}
              <div className="rounded-xl border p-4">
                <div className="font-bold text-sm mb-1">Task</div>
                <div className="text-sm text-muted-foreground">{week.task}</div>
              </div>

              {/* Skills Grid */}
              {week.skills && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {week.skills.listening && (
                    <div className="rounded-lg border p-3 text-sm">
                      <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-1">Listening</div>
                      <div className="text-foreground/80">{week.skills.listening}</div>
                    </div>
                  )}
                  {week.skills.speaking && (
                    <div className="rounded-lg border p-3 text-sm">
                      <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-1">Speaking</div>
                      <div className="text-foreground/80">{week.skills.speaking}</div>
                    </div>
                  )}
                  {week.skills.reading && (
                    <div className="rounded-lg border p-3 text-sm">
                      <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-1">Reading</div>
                      <div className="text-foreground/80">{week.skills.reading}</div>
                    </div>
                  )}
                  {week.skills.writing && (
                    <div className="rounded-lg border p-3 text-sm">
                      <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-1">Writing</div>
                      <div className="text-foreground/80">{week.skills.writing}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Assessment */}
              {week.assessment && week.assessment.length > 0 && (
                <div className="rounded-xl border bg-orange-50/50 p-4">
                  <div className="font-bold text-sm text-orange-900 mb-2 flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" /> Assessment
                  </div>
                  <ul className="space-y-1">
                    {week.assessment.map((a) => (
                      <li key={a} className="text-sm text-orange-800/80 flex items-start gap-2">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contrastive / Latin American Focus */}
              {week.contrastiveFocus && (
                <div className="rounded-xl border bg-purple-50/50 p-4">
                  <div className="font-bold text-sm text-purple-900 mb-1">Contrastive Focus</div>
                  <div className="text-sm text-purple-800/80">{week.contrastiveFocus}</div>
                </div>
              )}
              {week.latinAmericanFocus && (
                <div className="rounded-xl border bg-green-50/50 p-4">
                  <div className="font-bold text-sm text-green-900 mb-1">Latin American Focus</div>
                  <div className="text-sm text-green-800/80">{week.latinAmericanFocus}</div>
                </div>
              )}
            </div>

            {/* Tabs: Daily Practice / Conversation Circle / Resources */}
            <Tabs defaultValue="daily" className="w-full">
              <TabsList className="w-full grid grid-cols-3 h-auto p-1 bg-muted/50 rounded-xl mb-6 border border-border/50">
                <TabsTrigger value="daily" className="rounded-lg py-2.5 px-2 md:px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all text-xs md:text-sm">
                  <span className="md:hidden">Daily</span>
                  <span className="hidden md:inline">Daily Practice</span>
                </TabsTrigger>
                <TabsTrigger value="circle" className="rounded-lg py-2.5 px-2 md:px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all text-xs md:text-sm">
                  <span className="md:hidden">Session</span>
                  <span className="hidden md:inline">Conversation Circle</span>
                </TabsTrigger>
                <TabsTrigger value="resources" className="rounded-lg py-2.5 px-2 md:px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all text-xs md:text-sm">
                  <span className="md:hidden">Files</span>
                  <span className="hidden md:inline">Downloads</span>
                </TabsTrigger>
              </TabsList>

              {/* Daily Practice */}
              <TabsContent value="daily" className="space-y-6 animate-in fade-in-50 duration-500 slide-in-from-bottom-4">
                <div className="grid gap-4">
                  {week.dailyPrompts.map((prompt, i) => (
                    <Card key={i} className={`overflow-hidden transition-all duration-300 hover:shadow-md ${i === 0 ? 'border-primary ring-1 ring-primary/20 shadow-sm' : 'border-border opacity-90 hover:opacity-100'}`}>
                      <div className={`h-1.5 w-full ${i === 0 ? 'bg-primary' : 'bg-muted'}`} />
                      <CardContent className="p-5 md:p-6 flex flex-col md:flex-row gap-5 items-start">
                        <div className={`p-3 rounded-xl shrink-0 ${i === 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          <MessageCircle className="w-6 h-6" />
                        </div>
                        <div className="space-y-2 w-full">
                          <p className="font-heading font-medium text-base md:text-lg text-foreground leading-snug">{prompt}</p>
                          {i === 0 && (
                            <div className="pt-3 flex flex-wrap gap-3">
                              <Button size="sm" className="rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white gap-2 font-bold shadow-md hover:shadow-lg transition-all h-10 px-5 border-none">
                                <Mic className="w-4 h-4" /> Reply on WhatsApp
                              </Button>
                              <Button size="sm" variant="ghost" className="rounded-full text-muted-foreground gap-2 h-10 px-5">
                                <Clock className="w-4 h-4" /> ~2 mins
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Conversation Circle */}
              <TabsContent value="circle" className="space-y-6 animate-in fade-in-50 duration-500 slide-in-from-bottom-4">
                <Card className="bg-gradient-to-br from-secondary/10 to-transparent border-secondary/30 overflow-hidden">
                  <div className="h-2 bg-secondary" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                      <div className="p-2 bg-secondary/10 rounded-lg">
                        <Clock className="w-6 h-6 text-secondary-foreground" />
                      </div>
                      60-Minute Session Flow
                    </CardTitle>
                    <CardDescription className="text-base">
                      Here is what we will do together this week.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8 pl-2 sm:pl-6 md:pl-10">
                    <div className="relative border-l-2 border-secondary/30 pl-6 sm:pl-8 space-y-8 sm:space-y-10 ml-1 sm:ml-3 py-2">
                      {week.sessionFlow.map((step, idx) => (
                        <div key={idx} className="relative group">
                          <div className="absolute -left-[33px] sm:-left-[41px] top-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-4 border-white bg-secondary ring-2 ring-secondary/20 group-hover:scale-110 transition-transform" />
                          <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                            Step {step.step}: {step.title}{" "}
                            <span className="text-sm font-normal text-muted-foreground ml-2">({step.minutes} min)</span>
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-lg">{step.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Resources */}
              <TabsContent value="resources" className="space-y-6 animate-in fade-in-50 duration-500 slide-in-from-bottom-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {week.resources.map((r) => {
                    const available = !!r.href;
                    const Wrapper = available ? "a" : "div";
                    return (
                      <Wrapper key={r.id} {...(available ? { href: r.href, target: "_blank", rel: "noreferrer" } : {})} className="block">
                        <Card className={cn("transition-all", available ? "hover:bg-muted/50 cursor-pointer group hover:border-primary/50 hover:shadow-md" : "opacity-60")}>
                          <CardContent className="p-5 flex items-center gap-4">
                            <div className={cn("p-3 rounded-xl shadow-sm transition-all duration-300", available ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" : "bg-slate-100 text-slate-400")}>
                              <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <p className={cn("font-bold transition-colors", available ? "text-foreground group-hover:text-primary" : "text-foreground/60")}>{r.title}</p>
                              <p className="text-xs text-muted-foreground mt-1 uppercase">{available ? r.type : "Coming soon"}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </Wrapper>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>

            {/* Submissions */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Submissions
                </CardTitle>
                <CardDescription>Submit your voice recordings and writing assignments for this week.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={whatsappLink(`Week ${week.week} voice submission`)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white font-bold h-12 gap-2 shadow-md">
                      <Mic className="w-4 h-4" /> Submit Voice Recording (WhatsApp)
                    </Button>
                  </a>
                  <a
                    href={whatsappLink(`Week ${week.week} writing submission – ${track?.title ?? "cohort"}`)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full rounded-xl font-bold h-12 gap-2">
                      <Upload className="w-4 h-4" /> Submit Writing (WhatsApp)
                    </Button>
                  </a>
                </div>

                {week.assessment && week.assessment.length > 0 && (
                  <div className="rounded-xl border bg-orange-50/50 p-4">
                    <div className="font-bold text-sm text-orange-900 mb-1 flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" /> Assessment Submission
                    </div>
                    <div className="text-sm text-orange-800/80">
                      Submit the listed assessment items for Week {week.week}: {week.assessment.join(", ")}.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </Layout>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────

export default function CohortDashboard() {
  const params = useParams<{ trackId?: string }>();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-heading font-bold mb-3">Sign in to continue</h1>
          <p className="text-muted-foreground font-medium mb-8">
            You need to be signed in to access your cohort dashboard, track progress, and submit assignments.
          </p>
          <Link href="/auth">
            <Button size="lg" className="rounded-full font-bold shadow-lg h-14 px-10">
              <LogIn className="w-5 h-5 mr-2" /> Sign In
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (!params.trackId) {
    return <CohortListView />;
  }

  const track = getTrackById(params.trackId);
  if (!track) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-heading font-bold mb-4">Cohort not found</h1>
          <p className="text-muted-foreground mb-8">The cohort you requested does not exist.</p>
          <Link href="/dashboard">
            <Button className="rounded-full">Back to My Cohorts</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return <CohortInsideView track={track} />;
}
