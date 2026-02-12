import { useParams } from "wouter";
import { Link } from "wouter";
import Layout from "@/components/layout/Layout";
import { getTrackById } from "@/data/curriculum";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, GraduationCap, Target, ChevronLeft, Languages, Globe, Sparkles } from "lucide-react";
import CohortApplicationForm from "@/components/CohortApplicationForm";

export default function CohortDetail() {
  const params = useParams<{ trackId: string }>();
  const track = getTrackById(params.trackId);

  if (!track) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-heading font-bold mb-4">Cohort not found</h1>
          <p className="text-muted-foreground mb-8">The cohort you requested does not exist.</p>
          <Link href="/cohorts">
            <Button className="rounded-full">Back to Cohorts</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
          <Link href="/cohorts" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to all cohorts
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">{track.title}</h1>
                <Badge className="text-sm px-3 py-1">{track.cefrLevel}</Badge>
              </div>
              <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
                {track.communicativeFocus}
              </p>
            </div>
            <CohortApplicationForm
              trackId={track.id}
              trackTitle={track.title}
              trigger={
                <Button size="lg" className="rounded-full font-bold shadow-lg h-14 px-8 shrink-0" data-testid="button-join-cohort">
                  Join Cohort
                </Button>
              }
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid lg:grid-cols-[2fr_1fr] gap-8 items-start">

          {/* Main Content */}
          <div className="space-y-8">

            {/* You Will Learn */}
            <Card className="rounded-2xl shadow-lg border-none">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  You will learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {track.youWillLearn.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-foreground/80">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Weekly Syllabus */}
            <Card className="rounded-2xl shadow-lg border-none">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Weekly Syllabus (8 Weeks)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {track.weeks.map((w) => (
                    <AccordionItem key={w.week} value={`week-${w.week}`}>
                      <AccordionTrigger className="text-base">
                        <span className="font-bold text-left">
                          Week {w.week}: {w.title}
                        </span>
                      </AccordionTrigger>

                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <p className="text-muted-foreground leading-relaxed">{w.summary}</p>

                          {w.communicativeGoal && (
                            <div className="rounded-xl border bg-blue-50/50 p-4">
                              <div className="font-bold text-sm text-blue-900 mb-1">Communicative Goal</div>
                              <div className="text-sm text-blue-800/80">{w.communicativeGoal}</div>
                            </div>
                          )}

                          <div>
                            <div className="text-sm font-bold mb-2">Language Focus</div>
                            <div className="flex flex-wrap gap-2">
                              {w.languageFocus.map((lf) => (
                                <Badge key={lf} variant="outline" className="font-medium">
                                  {lf}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-xl border p-4">
                            <div className="font-bold text-sm mb-1">Task</div>
                            <div className="text-sm text-muted-foreground">{w.task}</div>
                          </div>

                          {w.skills && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {w.skills.listening && (
                                <div className="rounded-lg border p-3 text-sm">
                                  <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-1">Listening</div>
                                  <div className="text-foreground/80">{w.skills.listening}</div>
                                </div>
                              )}
                              {w.skills.speaking && (
                                <div className="rounded-lg border p-3 text-sm">
                                  <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-1">Speaking</div>
                                  <div className="text-foreground/80">{w.skills.speaking}</div>
                                </div>
                              )}
                              {w.skills.reading && (
                                <div className="rounded-lg border p-3 text-sm">
                                  <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-1">Reading</div>
                                  <div className="text-foreground/80">{w.skills.reading}</div>
                                </div>
                              )}
                              {w.skills.writing && (
                                <div className="rounded-lg border p-3 text-sm">
                                  <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-1">Writing</div>
                                  <div className="text-foreground/80">{w.skills.writing}</div>
                                </div>
                              )}
                            </div>
                          )}

                          {w.assessment && w.assessment.length > 0 && (
                            <div className="rounded-xl border bg-orange-50/50 p-4">
                              <div className="font-bold text-sm text-orange-900 mb-2">Assessment</div>
                              <ul className="space-y-1">
                                {w.assessment.map((a) => (
                                  <li key={a} className="text-sm text-orange-800/80 flex items-start gap-2">
                                    <GraduationCap className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                    {a}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {w.contrastiveFocus && (
                            <div className="rounded-xl border bg-purple-50/50 p-4">
                              <div className="font-bold text-sm text-purple-900 mb-1 flex items-center gap-1">
                                <Languages className="w-3.5 h-3.5" /> Contrastive Focus
                              </div>
                              <div className="text-sm text-purple-800/80">{w.contrastiveFocus}</div>
                            </div>
                          )}

                          {w.latinAmericanFocus && (
                            <div className="rounded-xl border bg-green-50/50 p-4">
                              <div className="font-bold text-sm text-green-900 mb-1 flex items-center gap-1">
                                <Globe className="w-3.5 h-3.5" /> Latin American Focus
                              </div>
                              <div className="text-sm text-green-800/80">{w.latinAmericanFocus}</div>
                            </div>
                          )}

                          {w.week === 1 && (
                            <Link href={`/tasters?track=${track.id}&week=1`}>
                              <Button variant="outline" className="rounded-xl font-bold">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Try Week 1 Taster
                              </Button>
                            </Link>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-28">
            {/* Assessment Card */}
            <Card className="rounded-2xl shadow-lg border-none">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Final Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground font-medium">{track.finalAssessment}</p>

                {track.ieltsAlignment && track.ieltsAlignment.length > 0 && (
                  <div className="rounded-xl border bg-violet-50/50 p-4">
                    <div className="font-bold text-sm text-violet-900 mb-2">IELTS Alignment</div>
                    <ul className="space-y-1">
                      {track.ieltsAlignment.map((item) => (
                        <li key={item} className="text-sm text-violet-800/80 flex items-start gap-2">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Outcomes Card */}
            <Card className="rounded-2xl shadow-lg border-none bg-primary text-white">
              <CardHeader>
                <CardTitle className="text-base text-white">What you'll be able to do</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {track.outcomes.map((o, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/90 text-sm">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-white/60 shrink-0" />
                      <span className="font-medium">{o}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <CohortApplicationForm
                    trackId={track.id}
                    trackTitle={track.title}
                    trigger={
                      <Button size="lg" className="w-full bg-white text-primary hover:bg-white/90 font-bold rounded-xl h-12 shadow-lg" data-testid="button-join-cohort-sidebar">
                        Join Cohort
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Info */}
            <div className="rounded-2xl border bg-muted/30 p-6 text-center">
              <p className="text-sm text-muted-foreground font-medium">{track.duration} • {track.level} level</p>
              <p className="text-xs text-muted-foreground mt-1">Designed by Professora Paz</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
