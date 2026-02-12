import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTasterModule, tasterModules, type ScaffoldLang, type TasterActivity, type LocalizedText } from "@/data/tasters";
import { Sparkles, RotateCcw, ChevronLeft, Mic, MessageSquare } from "lucide-react";
import { whatsappLink } from "@/lib/config";

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function getLocalizedText(lang: ScaffoldLang, text: LocalizedText) {
  if (lang === "ptBR") return text.ptBR ?? text.en;
  if (lang === "esLA") return text.esLA ?? text.en;
  return text.en;
}

const TRACK_LABELS: Record<string, { label: string; color: string }> = {
  "a1-beginner": { label: "A1 Beginner", color: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
  "a2-elementary": { label: "A2 Elementary", color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" },
  intermediate: { label: "Intermediate", color: "bg-violet-100 text-violet-800 hover:bg-violet-200" },
  advanced: { label: "Advanced", color: "bg-amber-100 text-amber-800 hover:bg-amber-200" },
};

function ActivityCard({ activity, lang }: { activity: TasterActivity; lang: ScaffoldLang }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState<"idle" | "correct" | "wrong">("idle");

  const reset = () => {
    setSelected(null);
    setInput("");
    setChecked("idle");
  };

  return (
    <Card className="rounded-2xl shadow-lg border-none overflow-hidden">
      <CardHeader className="space-y-1 pb-3">
        <CardTitle className="text-base font-bold">{activity.title}</CardTitle>
        <p className="text-sm text-muted-foreground leading-relaxed">{activity.prompt}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        {activity.type === "mcq" && (
          <>
            <div className="grid gap-2">
              {activity.options.map((opt, idx) => {
                const isPicked = selected === idx;
                const isCorrect = idx === activity.answerIndex;
                const showResult = checked !== "idle";

                let borderColor = "border-border";
                let bgColor = "";
                if (showResult && isPicked) {
                  borderColor = isCorrect ? "border-green-500" : "border-red-500";
                  bgColor = isCorrect ? "bg-green-50" : "bg-red-50";
                } else if (isPicked) {
                  borderColor = "border-primary";
                  bgColor = "bg-primary/5";
                }

                return (
                  <button
                    key={opt}
                    className={`rounded-xl border-2 ${borderColor} ${bgColor} px-4 py-3 text-left text-sm font-medium hover:bg-muted/50 transition-all`}
                    onClick={() => { setSelected(idx); setChecked("idle"); }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                onClick={() => {
                  if (selected === null) return;
                  setChecked(selected === activity.answerIndex ? "correct" : "wrong");
                }}
                className="rounded-xl font-bold"
              >
                <Sparkles className="w-4 h-4 mr-1" /> Check
              </Button>
              <Button variant="outline" size="sm" onClick={reset} className="rounded-xl">
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
              </Button>
            </div>

            {checked !== "idle" && (
              <div className={`rounded-xl border p-4 text-sm ${checked === "correct" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <div className="font-bold mb-1">
                  {checked === "correct" ? "Correct!" : "Not quite"}
                </div>
                <div className="text-muted-foreground leading-relaxed">
                  {getLocalizedText(lang, activity.explanation)}
                </div>
              </div>
            )}
          </>
        )}

        {activity.type === "fill" && (
          <>
            <input
              value={input}
              onChange={(e) => { setInput(e.target.value); setChecked("idle"); }}
              placeholder={activity.placeholder ?? "type your answer"}
              className="w-full rounded-xl border-2 border-border px-4 py-3 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />

            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                onClick={() => {
                  const ok = normalize(input) === normalize(activity.answer);
                  setChecked(ok ? "correct" : "wrong");
                }}
                className="rounded-xl font-bold"
              >
                <Sparkles className="w-4 h-4 mr-1" /> Check
              </Button>
              <Button variant="outline" size="sm" onClick={reset} className="rounded-xl">
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
              </Button>
            </div>

            {checked !== "idle" && (
              <div className={`rounded-xl border p-4 text-sm ${checked === "correct" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <div className="font-bold mb-1">
                  {checked === "correct" ? "Correct!" : "Not quite"}
                </div>
                <div className="text-muted-foreground leading-relaxed">
                  {getLocalizedText(lang, activity.explanation)}
                  {checked === "wrong" && (
                    <span className="block mt-2 font-medium text-foreground">
                      Expected: <span className="text-primary">{activity.answer}</span>
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function Tasters() {
  const search = useSearch();
  const [, navigate] = useLocation();

  const qs = new URLSearchParams(search || "");
  const trackId = (qs.get("track") ?? "a1-beginner") as string;
  const week = Number(qs.get("week") ?? "1") || 1;

  const module = getTasterModule(trackId, week) ?? tasterModules[0];

  const [lang, setLang] = useState<ScaffoldLang>(() => {
    try {
      return (localStorage.getItem("scaffoldLang") as ScaffoldLang) ?? "ptBR";
    } catch {
      return "ptBR";
    }
  });

  useEffect(() => {
    try { localStorage.setItem("scaffoldLang", lang); } catch {}
  }, [lang]);

  const setQuery = (t: string, w: number) => {
    navigate(`/tasters?track=${encodeURIComponent(t)}&week=${encodeURIComponent(String(w))}`);
  };

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <Link href="/cohorts" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Cohorts
          </Link>
          <h1 className="text-4xl md:text-5xl font-heading font-black mb-3 tracking-tight">
            Week {week} Tasters
          </h1>
          <p className="text-lg text-white/80 font-medium max-w-2xl">
            Try a few guided activities before joining a cohort. No account needed — just explore.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 -mt-6 relative z-10">
        {/* Help Language Toggle */}
        <Card className="rounded-2xl shadow-lg border-none mb-6">
          <CardContent className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold">Help language:</span>
              <button
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${lang === "ptBR" ? "bg-primary text-white border-primary" : "hover:bg-muted/60"}`}
                onClick={() => setLang("ptBR")}
              >
                Português
              </button>
              <button
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${lang === "esLA" ? "bg-primary text-white border-primary" : "hover:bg-muted/60"}`}
                onClick={() => setLang("esLA")}
              >
                Español
              </button>
              <button
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${lang === "en" ? "bg-primary text-white border-primary" : "hover:bg-muted/60"}`}
                onClick={() => setLang("en")}
              >
                English only
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Prompts stay in English; explanations switch to your selected language.
            </p>
          </CardContent>
        </Card>

        {/* Track Filter Pills */}
        <Card className="rounded-2xl shadow-lg border-none mb-6">
          <CardContent className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold">Track:</span>
              {(["a1-beginner", "a2-elementary", "intermediate", "advanced"] as const).map((t) => {
                const info = TRACK_LABELS[t];
                const isActive = module.trackId === t;
                return (
                  <button
                    key={t}
                    onClick={() => setQuery(t, week)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-bold transition-all ${
                      isActive ? info.color + " border-transparent" : "hover:bg-muted/60"
                    }`}
                  >
                    {info.label}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Week:</span>
              <button
                className="rounded-lg border px-3 py-1 text-sm hover:bg-muted/40 font-bold"
                onClick={() => setQuery(module.trackId, Math.max(1, week - 1))}
              >
                -
              </button>
              <Badge variant="secondary" className="text-sm font-bold px-3">Week {week}</Badge>
              <button
                className="rounded-lg border px-3 py-1 text-sm hover:bg-muted/40 font-bold"
                onClick={() => setQuery(module.trackId, Math.min(8, week + 1))}
              >
                +
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Module Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h2 className="text-2xl md:text-3xl font-heading font-bold">{module.title}</h2>
          </div>
          <p className="text-muted-foreground font-medium">{getLocalizedText(lang, module.subtitle)}</p>
        </div>

        {/* Activities Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {module.activities.map((a) => (
            <ActivityCard key={a.id} activity={a} lang={lang} />
          ))}
        </div>

        {/* Speaking Prompt */}
        {module.speakingPrompt && (
          <div className="mt-8">
            <Card className="rounded-2xl shadow-lg border-none bg-gradient-to-r from-orange-50 to-yellow-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mic className="w-5 h-5 text-orange-600" />
                  {module.speakingPrompt.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {getLocalizedText(lang, module.speakingPrompt.prompt)}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm font-bold">Checklist</div>
                <ul className="space-y-2">
                  {module.speakingPrompt.checklist.map((x) => (
                    <li key={x.en} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                      {getLocalizedText(lang, x)}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-3 sm:flex-row pt-2">
                  <Button className="rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg" asChild>
                    <a href={whatsappLink(`Week ${week} voice note – ${module.title}`)} target="_blank" rel="noreferrer">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Voice Note (WhatsApp)
                    </a>
                  </Button>
                  <Link href={`/cohorts/${module.trackId}`}>
                    <Button variant="outline" className="rounded-xl font-bold">
                      View Full Cohort
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground font-medium mb-4">
            Ready to start the full 8-week journey?
          </p>
          <Link href={`/cohorts/${module.trackId}`}>
            <Button size="lg" className="rounded-full font-bold shadow-lg h-14 px-10 text-lg">
              Join {TRACK_LABELS[module.trackId]?.label ?? module.trackId} Cohort
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
