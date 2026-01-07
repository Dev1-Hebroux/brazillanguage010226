import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Mic, MessageCircle, Play, CheckCircle2, Lock, FileText, Clock, Trophy, Map, ChevronRight, MenuSquare } from "lucide-react";

export default function CohortDashboard() {
  const curriculum = [
    { week: 1, title: "Welcome & Introductions", status: "completed" },
    { week: 2, title: "Daily Life & Routines", status: "active" },
    { week: 3, title: "Places in the City", status: "locked" },
    { week: 4, title: "People & Relationships", status: "locked" },
    { week: 5, title: "Work & Skills", status: "locked" },
    { week: 6, title: "Customer Conversations", status: "locked" },
    { week: 7, title: "Problems & Solutions", status: "locked" },
    { week: 8, title: "Your Story & Next Horizon", status: "locked" },
  ];

  const CurriculumList = () => (
    <div className="divide-y divide-border">
      {curriculum.map((item) => (
        <div 
          key={item.week} 
          className={`p-4 flex items-center gap-3 transition-colors ${
            item.status === 'active' ? 'bg-primary/5 border-l-4 border-l-primary' : 
            item.status === 'locked' ? 'opacity-60' : 'bg-muted/10'
          }`}
        >
          <div className="shrink-0">
            {item.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
            {item.status === 'active' && <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-primary animate-pulse" /></div>}
            {item.status === 'locked' && <Lock className="w-4 h-4 text-muted-foreground" />}
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Week {item.week}</p>
            <p className={`text-sm font-medium ${item.status === 'active' ? 'text-primary font-bold' : 'text-foreground/80'}`}>
              {item.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Layout>
      <div className="bg-muted/30 border-b border-border sticky top-[72px] z-30 backdrop-blur-sm bg-white/80 supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary tracking-tight">My Cohort: Foundations</h1>
              <p className="text-muted-foreground font-medium flex items-center gap-2 text-sm md:text-base">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Week 2 of 8 • "Daily Life & Routines"
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-border shadow-sm ring-1 ring-black/5">
              <div className="text-right hidden sm:block shrink-0">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Overall Progress</p>
                <p className="text-sm font-bold text-primary">15% Complete</p>
              </div>
              <Progress value={15} className="w-full sm:w-32 h-2.5" />
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
          
          {/* Desktop Sidebar: Curriculum Map */}
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
               <p className="text-sm text-muted-foreground mb-4 leading-relaxed">You're doing great! Keep up the daily rhythm.</p>
               <div className="space-y-3">
                 <div className="flex justify-between text-sm items-center">
                   <span className="font-medium">Clarity</span>
                   <div className="flex gap-1">
                     {[1,2,3,4,5].map(s => <div key={s} className={`w-6 h-1.5 rounded-full transition-all ${s <= 3 ? 'bg-accent' : 'bg-accent/20'}`} />)}
                   </div>
                 </div>
                 <div className="flex justify-between text-sm items-center">
                   <span className="font-medium">Length</span>
                   <div className="flex gap-1">
                     {[1,2,3,4,5].map(s => <div key={s} className={`w-6 h-1.5 rounded-full transition-all ${s <= 2 ? 'bg-accent' : 'bg-accent/20'}`} />)}
                   </div>
                 </div>
                 <div className="flex justify-between text-sm items-center">
                   <span className="font-medium">Confidence</span>
                   <div className="flex gap-1">
                     {[1,2,3,4,5].map(s => <div key={s} className={`w-6 h-1.5 rounded-full transition-all ${s <= 3 ? 'bg-accent' : 'bg-accent/20'}`} />)}
                   </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Main Content: Week 2 Details */}
          <div className="space-y-8 min-w-0">
             
             {/* Weekly Lesson Header */}
             <div className="flex flex-col sm:flex-row items-start justify-between bg-white p-6 rounded-2xl border border-border shadow-sm gap-4 ring-1 ring-black/5">
               <div>
                 <Badge variant="secondary" className="mb-3">Current Week</Badge>
                 <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">Week 2: Daily Life & Routines</h2>
                 <p className="text-muted-foreground leading-relaxed">Focus: Simple present tense, time phrases, and sharing your daily habits.</p>
               </div>
               <Button className="shrink-0 rounded-full gap-2 w-full sm:w-auto h-12 shadow-lg shadow-primary/20">
                 <Play className="w-4 h-4 fill-current" /> Start Lesson
               </Button>
             </div>

             <Tabs defaultValue="daily" className="w-full">
               <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 scrollbar-hide">
                 <TabsList className="w-auto inline-flex justify-start h-auto p-1.5 bg-muted/50 rounded-xl mb-6 border border-border/50">
                   <TabsTrigger value="daily" className="rounded-lg py-2.5 px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all">Daily Practice</TabsTrigger>
                   <TabsTrigger value="circle" className="rounded-lg py-2.5 px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all">Conversation Circle</TabsTrigger>
                   <TabsTrigger value="resources" className="rounded-lg py-2.5 px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all">Downloads</TabsTrigger>
                 </TabsList>
               </div>

               <TabsContent value="daily" className="space-y-6 animate-in fade-in-50 duration-500 slide-in-from-bottom-4">
                  <div className="grid gap-4">
                    {[
                      { day: "Monday", prompt: "Say hello and share one good thing about your day (20 seconds).", type: "Warm up" },
                      { day: "Tuesday", prompt: "Describe your favorite food and why you like it.", type: "Description" },
                      { day: "Wednesday", prompt: "Invite a friend to coffee (use the phrase 'Would you like to...').", type: "Interaction" },
                      { day: "Thursday", prompt: "What’s one goal you have this month?", type: "Reflection" }
                    ].map((item, i) => (
                      <Card key={i} className={`overflow-hidden transition-all duration-300 hover:shadow-md ${i === 0 ? 'border-primary ring-1 ring-primary/20 shadow-sm' : 'border-border opacity-90 hover:opacity-100'}`}>
                        <div className={`h-1.5 w-full ${i === 0 ? 'bg-primary' : 'bg-muted'}`} />
                        <CardContent className="p-5 md:p-6 flex flex-col md:flex-row gap-5 items-start">
                           <div className={`p-3 rounded-xl shrink-0 ${i === 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                             <MessageCircle className="w-6 h-6" />
                           </div>
                           <div className="space-y-2 w-full">
                             <div className="flex flex-wrap items-center gap-2">
                               <span className="font-bold text-sm uppercase tracking-wider text-muted-foreground">{item.day}</span>
                               <Badge variant={i === 0 ? "default" : "outline"} className="text-[10px] h-5">{item.type}</Badge>
                             </div>
                             <p className="font-heading font-medium text-lg md:text-xl text-foreground leading-snug">"{item.prompt}"</p>
                             {i === 0 && (
                               <div className="pt-4 flex flex-wrap gap-3">
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

               <TabsContent value="circle" className="space-y-6 animate-in fade-in-50 duration-500 slide-in-from-bottom-4">
                 <Card className="bg-gradient-to-br from-secondary/10 to-transparent border-secondary/30 overflow-hidden">
                   <div className="h-2 bg-secondary" />
                   <CardHeader>
                     <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                       <div className="p-2 bg-secondary/10 rounded-lg">
                         <Clock className="w-6 h-6 text-secondary-foreground" />
                       </div>
                       This Week's Session Flow
                     </CardTitle>
                     <CardDescription className="text-base">
                       We meet every Thursday at 19:00. Here is what we will do together.
                     </CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-8 pl-6 md:pl-10">
                     <div className="relative border-l-2 border-secondary/30 pl-8 space-y-10 ml-3 py-2">
                       {[
                         { time: "5 mins", title: "Warm Welcome & Check-in", desc: "Say hello, quick mood check." },
                         { time: "15 mins", title: "Guided Speaking Round", desc: "Everyone answers one simple question about their daily routine." },
                         { time: "15 mins", title: "Pair Practice / Breakout", desc: "Practice the 'Inviting a friend' dialogue in pairs." },
                         { time: "15 mins", title: "Real-life Roleplay", desc: "Ordering coffee or asking for schedule changes." },
                         { time: "10 mins", title: "Celebrate Wins", desc: "Share one new word you learned and set a goal for next week." }
                       ].map((step, idx) => (
                         <div key={idx} className="relative group">
                           <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-white bg-secondary ring-2 ring-secondary/20 group-hover:scale-110 transition-transform" />
                           <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{step.title} <span className="text-sm font-normal text-muted-foreground ml-2">({step.time})</span></h4>
                           <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-lg">{step.desc}</p>
                         </div>
                       ))}
                     </div>
                   </CardContent>
                 </Card>
               </TabsContent>

               <TabsContent value="resources" className="space-y-6 animate-in fade-in-50 duration-500 slide-in-from-bottom-4">
                 <div className="grid md:grid-cols-2 gap-4">
                   {["Week 2 Vocabulary List.pdf", "Audio: Pronunciation Guide.mp3", "Dialogue Script: At the Cafe.pdf", "Worksheet: Daily Habits.pdf"].map((file, i) => (
                     <Card key={i} className="hover:bg-muted/50 transition-all cursor-pointer group hover:border-primary/50 hover:shadow-md">
                       <CardContent className="p-5 flex items-center gap-4">
                         <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                           <FileText className="w-6 h-6" />
                         </div>
                         <div>
                           <p className="font-bold text-foreground group-hover:text-primary transition-colors">{file}</p>
                           <p className="text-xs text-muted-foreground mt-1">Updated yesterday • 2.4 MB</p>
                         </div>
                       </CardContent>
                     </Card>
                   ))}
                 </div>
               </TabsContent>
             </Tabs>

          </div>
        </div>
      </div>
    </Layout>
  );
}
