import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar, GraduationCap, Coffee } from "lucide-react";
import { Link } from "wouter";
import { tracks } from "@/data/curriculum";
import heroImage from "@assets/generated_images/diverse_group_of_happy_students_studying_outdoors_in_brazil.png";

const colorMap: Record<string, { bar: string; badge: string; badgeText: string; btn: string }> = {
  "a1-beginner": {
    bar: "bg-blue-500",
    badge: "bg-blue-100 text-blue-800",
    badgeText: "text-blue-800",
    btn: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200",
  },
  "a2-elementary": {
    bar: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-800",
    badgeText: "text-emerald-800",
    btn: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200",
  },
  intermediate: {
    bar: "bg-violet-500",
    badge: "bg-violet-100 text-violet-800",
    badgeText: "text-violet-800",
    btn: "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200",
  },
  advanced: {
    bar: "bg-amber-500",
    badge: "bg-amber-100 text-amber-800",
    badgeText: "text-amber-800",
    btn: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200",
  },
};

export default function Cohorts() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative py-20 md:py-28 bg-gradient-to-r from-blue-600 to-green-500 overflow-hidden min-h-[480px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
            alt="Happy students studying"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-3xl">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-sm mb-6 animate-in fade-in slide-in-from-top-4 duration-700 shadow-lg">
            Applications Open for February 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black mb-6 text-white drop-shadow-xl tracking-tight leading-[0.9]">
            English for Impact — <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 drop-shadow-none">Cohort Programs</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed drop-shadow-md max-w-2xl mx-auto">
            8-week cohorts designed for real communication progress (Beginner to Advanced).
          </p>
          <p className="text-sm text-white/70 mt-4 font-medium">
            Designed by Professora Paz
          </p>
        </div>
      </div>

      {/* 4 Cohort Cards */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 -mt-10 md:-mt-16 relative z-20">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {tracks.map((track) => {
            const colors = colorMap[track.id] ?? colorMap["a1-beginner"];
            return (
              <Card key={track.id} className="flex flex-col border-none shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white overflow-hidden rounded-[2rem] group h-full">
                <div className={`h-3 w-full ${colors.bar}`} />
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={`${colors.badge} border-none font-bold text-xs px-3 py-1.5 uppercase tracking-wide`}>
                      {track.cefrLevel}
                    </Badge>
                    <Badge variant="outline" className="font-bold text-xs px-3 py-1.5 uppercase tracking-wide">
                      {track.level}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl font-heading font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                    {track.title}
                  </CardTitle>
                  <CardDescription className="text-base mt-2 text-muted-foreground font-medium leading-relaxed">
                    {track.whoItsFor}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-grow space-y-6 pt-4">
                  {/* Outcomes */}
                  <ul className="space-y-4">
                    {track.outcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-foreground/80 font-medium">
                        <div className={`mt-1 p-0.5 rounded-full ${colors.badge.split(" ")[0]} shrink-0`}>
                          <Check className={`w-3 h-3 ${colors.badgeText}`} />
                        </div>
                        <span className="leading-snug">{outcome}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Final Assessment + Duration */}
                  <div className="pt-6 border-t border-border mt-auto space-y-3">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                      <GraduationCap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span><span className="font-bold">Final assessment:</span> {track.finalAssessment}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{track.duration}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2 pb-6 md:pb-8">
                  <Link href={`/cohorts/${track.id}`} className="w-full">
                    <Button size="lg" className={`w-full rounded-xl text-lg h-14 font-bold shadow-lg transition-all active:scale-[0.98] ${colors.btn}`}>
                      View Cohort
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* English Café Section */}
        <div className="mt-20 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 border border-green-200 shadow-inner">
          <div className="md:flex items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-2">
                <Coffee className="w-6 h-6 text-green-700" />
                <h3 className="text-3xl font-heading font-bold text-green-900">English Café</h3>
              </div>
              <p className="text-green-800/80 font-medium text-lg">
                Weekly conversation events for practice, community, and confidence — open to all levels.
                In-person meetups in Brasília with game nights, themed discussions, and good vibes.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Link href="/events">
                <Button size="lg" className="rounded-full bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg h-14 px-8">
                  View Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
