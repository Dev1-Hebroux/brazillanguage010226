import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, MessageCircle, Play, CheckCircle2, Lock, FileText, Clock, Trophy } from "lucide-react";

export default function CohortDashboard() {
  return (
    <Layout>
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-heading font-bold text-primary">My Cohort: Foundations</h1>
              <p className="text-muted-foreground">Week 2 of 8 • "Daily Life & Routines"</p>
            </div>
            <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-border shadow-sm">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground font-bold uppercase">Overall Progress</p>
                <p className="text-sm font-bold text-primary">15% Complete</p>
              </div>
              <Progress value={15} className="w-32 h-3" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          
          {/* Sidebar: Curriculum Map */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/20">
                <h3 className="font-heading font-bold">Curriculum Map</h3>
              </div>
              <div className="divide-y divide-border">
                {[
                  { week: 1, title: "Welcome & Introductions", status: "completed" },
                  { week: 2, title: "Daily Life & Routines", status: "active" },
                  { week: 3, title: "Places in the City", status: "locked" },
                  { week: 4, title: "People & Relationships", status: "locked" },
                  { week: 5, title: "Work & Skills", status: "locked" },
                  { week: 6, title: "Customer Conversations", status: "locked" },
                  { week: 7, title: "Problems & Solutions", status: "locked" },
                  { week: 8, title: "Your Story & Next Horizon", status: "locked" },
                ].map((item) => (
                  <div 
                    key={item.week} 
                    className={`p-4 flex items-center gap-3 ${
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
                      <p className="text-xs text-muted-foreground font-bold uppercase">Week {item.week}</p>
                      <p className={`text-sm font-medium ${item.status === 'active' ? 'text-primary font-bold' : ''}`}>
                        {item.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-accent/10 rounded-xl p-6 border border-accent/20">
               <div className="flex items-center gap-2 mb-3">
                 <Trophy className="w-5 h-5 text-accent-foreground" />
                 <h3 className="font-heading font-bold text-accent-foreground">My Progress</h3>
               </div>
               <p className="text-sm text-muted-foreground mb-4">You're doing great! Keep up the daily rhythm.</p>
               <div className="space-y-3">
                 <div className="flex justify-between text-sm">
                   <span>Clarity</span>
                   <div className="flex gap-1">
                     {[1,2,3,4,5].map(s => <div key={s} className={`w-4 h-1 rounded-full ${s <= 3 ? 'bg-accent' : 'bg-accent/20'}`} />)}
                   </div>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span>Length</span>
                   <div className="flex gap-1">
                     {[1,2,3,4,5].map(s => <div key={s} className={`w-4 h-1 rounded-full ${s <= 2 ? 'bg-accent' : 'bg-accent/20'}`} />)}
                   </div>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span>Confidence</span>
                   <div className="flex justify-between text-sm"></div>
                   <div className="flex gap-1">
                     {[1,2,3,4,5].map(s => <div key={s} className={`w-4 h-1 rounded-full ${s <= 3 ? 'bg-accent' : 'bg-accent/20'}`} />)}
                   </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Main Content: Week 2 Details */}
          <div className="space-y-8">
             
             {/* Weekly Lesson Header */}
             <div className="flex items-start justify-between bg-white p-6 rounded-2xl border border-border shadow-sm">
               <div>
                 <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Week 2: Daily Life & Routines</h2>
                 <p className="text-muted-foreground">Focus: Simple present tense, time phrases, and sharing your daily habits.</p>
               </div>
               <Button className="shrink-0 rounded-full gap-2">
                 <Play className="w-4 h-4" /> Start Lesson
               </Button>
             </div>

             <Tabs defaultValue="daily" className="w-full">
               <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 rounded-xl mb-6">
                 <TabsTrigger value="daily" className="rounded-lg py-2.5 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Daily Practice</TabsTrigger>
                 <TabsTrigger value="circle" className="rounded-lg py-2.5 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Conversation Circle</TabsTrigger>
                 <TabsTrigger value="resources" className="rounded-lg py-2.5 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Downloads</TabsTrigger>
               </TabsList>

               <TabsContent value="daily" className="space-y-6 animate-in fade-in-50 duration-500">
                  <div className="grid gap-4">
                    {[
                      { day: "Monday", prompt: "Say hello and share one good thing about your day (20 seconds).", type: "Warm up" },
                      { day: "Tuesday", prompt: "Describe your favorite food and why you like it.", type: "Description" },
                      { day: "Wednesday", prompt: "Invite a friend to coffee (use the phrase 'Would you like to...').", type: "Interaction" },
                      { day: "Thursday", prompt: "What’s one goal you have this month?", type: "Reflection" }
                    ].map((item, i) => (
                      <Card key={i} className={`border-l-4 ${i === 0 ? 'border-l-primary bg-primary/5' : 'border-l-muted-foreground/30 opacity-80'}`}>
                        <CardContent className="p-5 flex gap-4 items-start">
                           <div className={`p-3 rounded-full shrink-0 ${i === 0 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                             <MessageCircle className="w-5 h-5" />
                           </div>
                           <div className="space-y-1">
                             <div className="flex items-center gap-2">
                               <span className="font-bold text-sm uppercase tracking-wider text-muted-foreground">{item.day}</span>
                               <Badge variant="outline" className="text-[10px] h-5">{item.type}</Badge>
                             </div>
                             <p className="font-medium text-lg">"{item.prompt}"</p>
                             {i === 0 && (
                               <div className="pt-3">
                                 <Button size="sm" className="rounded-full bg-green-600 hover:bg-green-700 text-white gap-2">
                                   <Mic className="w-4 h-4" /> Send Voice Note on WhatsApp
                                 </Button>
                               </div>
                             )}
                           </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
               </TabsContent>

               <TabsContent value="circle" className="space-y-6 animate-in fade-in-50 duration-500">
                 <Card className="bg-secondary/20 border-secondary">
                   <CardHeader>
                     <CardTitle className="flex items-center gap-3">
                       <Clock className="w-6 h-6 text-primary" />
                       This Week's Session Flow
                     </CardTitle>
                     <CardDescription>
                       We meet every Thursday at 19:00. Here is what we will do together.
                     </CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-6">
                     <div className="relative border-l-2 border-primary/20 pl-8 space-y-8 ml-3">
                       {[
                         { time: "5 mins", title: "Warm Welcome & Check-in", desc: "Say hello, quick mood check." },
                         { time: "15 mins", title: "Guided Speaking Round", desc: "Everyone answers one simple question about their daily routine." },
                         { time: "15 mins", title: "Pair Practice / Breakout", desc: "Practice the 'Inviting a friend' dialogue in pairs." },
                         { time: "15 mins", title: "Real-life Roleplay", desc: "Ordering coffee or asking for schedule changes." },
                         { time: "10 mins", title: "Celebrate Wins", desc: "Share one new word you learned and set a goal for next week." }
                       ].map((step, idx) => (
                         <div key={idx} className="relative">
                           <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-white bg-primary" />
                           <h4 className="font-bold text-foreground">{step.title} <span className="text-sm font-normal text-muted-foreground ml-2">({step.time})</span></h4>
                           <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                         </div>
                       ))}
                     </div>
                   </CardContent>
                 </Card>
               </TabsContent>

               <TabsContent value="resources" className="space-y-6 animate-in fade-in-50 duration-500">
                 <div className="grid md:grid-cols-2 gap-4">
                   {["Week 2 Vocabulary List.pdf", "Audio: Pronunciation Guide.mp3", "Dialogue Script: At the Cafe.pdf", "Worksheet: Daily Habits.pdf"].map((file, i) => (
                     <Card key={i} className="hover:bg-muted/50 transition-colors cursor-pointer group">
                       <CardContent className="p-4 flex items-center gap-4">
                         <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                           <FileText className="w-5 h-5" />
                         </div>
                         <div>
                           <p className="font-medium group-hover:text-primary transition-colors">{file}</p>
                           <p className="text-xs text-muted-foreground">Updated yesterday</p>
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
