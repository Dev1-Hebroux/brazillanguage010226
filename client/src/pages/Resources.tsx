import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Play, Download, FileText, MessageCircle, CheckCircle } from "lucide-react";
import heroImage from "@assets/generated_images/sophisticated_adult_learning_resources_flatlay.png";

export default function Resources() {
  return (
    <Layout>
      <div className="relative py-20 md:py-28 bg-yellow-400 overflow-hidden min-h-[480px] flex items-center">
        <div className="absolute inset-0 z-0">
           <img 
             src={heroImage} 
             className="w-full h-full object-cover opacity-20" 
             alt="Learning resources" 
             loading="eager"
             fetchPriority="high"
           />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 text-foreground drop-shadow-sm">
              Resources
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 font-medium max-w-2xl">
              Placement tools, free lessons, and downloads to help you start your journey.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid md:grid-cols-[2fr_1fr] gap-12">
          
          {/* Main Content Area */}
          <div className="space-y-12">
            
            {/* Placement Section */}
            <section className="space-y-6">
              <h2 className="text-3xl font-heading font-bold text-primary flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">1</span>
                Where should I start?
              </h2>
              <div className="bg-white rounded-3xl border border-border shadow-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-bl-full -mr-8 -mt-8" />
                
                <p className="text-lg text-foreground/80 font-medium mb-8 relative z-10">
                  Answer these simple questions to find your best fit. Be honest—there is no wrong answer!
                </p>
                
                <div className="space-y-6 mb-8 relative z-10">
                   <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                     <p className="font-bold text-lg mb-4 text-foreground">1. Can you introduce yourself confidently in English?</p>
                     <div className="flex flex-wrap gap-3">
                       <Button variant="outline" className="rounded-full border-2 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">Yes, easily</Button>
                       <Button variant="outline" className="rounded-full border-2 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">Sometimes</Button>
                       <Button variant="outline" className="rounded-full border-2 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">Not yet</Button>
                     </div>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                     <p className="font-bold text-lg mb-4 text-foreground">2. Can you order food or ask for directions?</p>
                     <div className="flex flex-wrap gap-3">
                       <Button variant="outline" className="rounded-full border-2 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">Yes, usually</Button>
                       <Button variant="outline" className="rounded-full border-2 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">With difficulty</Button>
                       <Button variant="outline" className="rounded-full border-2 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">I use a translator</Button>
                     </div>
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-blue-600 to-blue-500 p-6 rounded-2xl shadow-lg relative z-10 text-white">
                   <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0 font-bold text-2xl animate-pulse">?</div>
                   <div className="text-center sm:text-left">
                     <p className="font-bold text-lg">Not sure?</p>
                     <p className="text-blue-100 text-sm">Send us a short voice note (30 seconds) introducing yourself. We will recommend the perfect group.</p>
                   </div>
                   <Button size="lg" className="sm:ml-auto bg-green-500 hover:bg-green-600 text-white rounded-full font-bold shadow-md whitespace-nowrap">
                     WhatsApp Us
                   </Button>
                </div>
              </div>
            </section>

            {/* Week 1 Lesson Demo */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                 <span className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold border border-accent-foreground/10">2</span>
                 <h2 className="text-3xl font-heading font-bold text-foreground">Try a Free Lesson</h2>
              </div>
              
              <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-xl">
                <div className="bg-slate-900 p-6 border-b border-border flex items-center justify-between text-white">
                  <div>
                    <span className="font-bold text-xs text-yellow-400 uppercase tracking-wider block mb-1">Week 1 Preview</span>
                    <h3 className="text-xl font-bold">Welcome & Introductions</h3>
                  </div>
                  <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20">
                    <Download className="w-4 h-4 mr-2" /> PDF
                  </Button>
                </div>
                <div className="p-8 space-y-8">
                   <div className="space-y-4">
                     <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                       <MessageCircle className="w-5 h-5 text-primary" /> Key Phrases
                     </h3>
                     <div className="grid sm:grid-cols-2 gap-4">
                       {[
                         "My name is...",
                         "I'm from...",
                         "Nice to meet you.",
                         "I work as a..."
                       ].map(phrase => (
                         <div key={phrase} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary/50 transition-colors group cursor-pointer">
                            <span className="font-medium text-foreground">{phrase}</span>
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                              <Play className="w-3 h-3 ml-0.5" />
                            </div>
                         </div>
                       ))}
                     </div>
                   </div>

                   <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400/20 rounded-bl-full" />
                      <h3 className="text-lg font-bold text-yellow-900 mb-4 flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-yellow-500" /> Daily Practice Prompt
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-grow">
                          <p className="font-medium text-lg text-foreground mb-2">Voice Note Challenge (20s)</p>
                          <p className="text-muted-foreground italic">"Say hello to the group, tell us your name, and one thing you like (coffee, soccer, music)."</p>
                        </div>
                        <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full font-bold shadow-md self-start shrink-0">
                          Open WhatsApp
                        </Button>
                      </div>
                   </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-primary p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <h3 className="font-heading font-bold text-2xl mb-4 relative z-10">Student Guide</h3>
              <p className="text-white/80 mb-8 font-medium relative z-10 leading-relaxed">
                Everything you need to know about our community rules, schedules, and tips for success.
              </p>
              <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold rounded-full h-12 shadow-lg relative z-10">
                <Download className="w-4 h-4 mr-2" /> Download Guide PDF
              </Button>
            </div>

            <div className="p-8 border-2 border-slate-100 rounded-3xl bg-white shadow-lg">
              <h3 className="font-heading font-bold text-xl mb-6 text-foreground">Useful Downloads</h3>
              <ul className="space-y-4">
                 {[
                   {name: "Pronunciation Cheat Sheet", type: "PDF"},
                   {name: "100 Most Common Verbs", type: "PDF"},
                   {name: "Conversation Starters", type: "PDF"},
                   {name: "Community Playlist", type: "Spotify"}
                 ].map((link, i) => (
                   <li key={i}>
                     <a href="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                         </div>
                         <span className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">{link.name}</span>
                       </div>
                       <Download className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                     </a>
                   </li>
                 ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
