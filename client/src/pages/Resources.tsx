import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Play, Download, FileText, MessageCircle, CheckCircle } from "lucide-react";

export default function Resources() {
  return (
    <Layout>
      <div className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary">Resources</h1>
            <p className="text-xl text-muted-foreground">
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
              <h2 className="text-2xl font-heading font-bold text-foreground">Where should I start?</h2>
              <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
                <p className="text-lg text-muted-foreground mb-6">Answer these simple questions to find your best fit. Be honest—there is no wrong answer!</p>
                
                <div className="space-y-4 mb-8">
                   <div className="p-4 bg-muted/20 rounded-xl">
                     <p className="font-bold mb-3">1. Can you introduce yourself confidently in English?</p>
                     <div className="flex gap-3">
                       <Button variant="outline" size="sm" className="rounded-full">Yes, easily</Button>
                       <Button variant="outline" size="sm" className="rounded-full">Sometimes</Button>
                       <Button variant="outline" size="sm" className="rounded-full">Not yet</Button>
                     </div>
                   </div>
                   <div className="p-4 bg-muted/20 rounded-xl">
                     <p className="font-bold mb-3">2. Can you order food or ask for directions?</p>
                     <div className="flex gap-3">
                       <Button variant="outline" size="sm" className="rounded-full">Yes, usually</Button>
                       <Button variant="outline" size="sm" className="rounded-full">With difficulty</Button>
                       <Button variant="outline" size="sm" className="rounded-full">I use a translator</Button>
                     </div>
                   </div>
                </div>

                <div className="flex items-center gap-4 bg-primary/5 p-4 rounded-xl border border-primary/10">
                   <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold">?</div>
                   <div>
                     <p className="font-bold text-primary">Not sure?</p>
                     <p className="text-sm text-muted-foreground">Send us a short voice note (30 seconds) introducing yourself. We will recommend the perfect group.</p>
                   </div>
                   <Button size="sm" className="ml-auto bg-green-600 hover:bg-green-700 text-white rounded-full">WhatsApp Us</Button>
                </div>
              </div>
            </section>

            {/* Week 1 Lesson Demo */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">1</div>
                 <h2 className="text-2xl font-heading font-bold">Week 1: Welcome & Introductions</h2>
              </div>
              
              <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="bg-muted p-4 border-b border-border flex items-center justify-between">
                  <span className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Lesson Preview</span>
                  <Button size="sm" variant="ghost" className="h-8 text-primary">Download PDF</Button>
                </div>
                <div className="p-8 space-y-6">
                   <div className="space-y-4">
                     <h3 className="text-xl font-bold">Key Phrases</h3>
                     <div className="grid sm:grid-cols-2 gap-4">
                       {[
                         "My name is...",
                         "I'm from...",
                         "Nice to meet you.",
                         "I work as a..."
                       ].map(phrase => (
                         <div key={phrase} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-secondary/50">
                            <span>{phrase}</span>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-white"><Play className="w-3 h-3" /></Button>
                         </div>
                       ))}
                     </div>
                   </div>

                   <div className="space-y-4 pt-4 border-t border-dashed">
                      <h3 className="text-xl font-bold">Daily Practice Prompt</h3>
                      <div className="bg-accent/10 p-6 rounded-xl border border-accent/20">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-accent/20 rounded-full text-accent-foreground">
                            <MessageCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground mb-2">Voice Note Challenge (20 seconds)</p>
                            <p className="text-muted-foreground italic mb-4">"Say hello to the group, tell us your name, and one thing you like (coffee, soccer, music)."</p>
                            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">Open WhatsApp</Button>
                          </div>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-primary text-white p-6 rounded-2xl shadow-lg">
              <h3 className="font-heading font-bold text-xl mb-4">Student Guide</h3>
              <p className="text-primary-foreground/80 mb-6 text-sm">Everything you need to know about our community rules, schedules, and tips for success.</p>
              <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold rounded-full">
                <Download className="w-4 h-4 mr-2" /> Download Guide PDF
              </Button>
            </div>

            <div className="p-6 border border-border rounded-2xl bg-white shadow-sm">
              <h3 className="font-heading font-bold text-lg mb-4">Useful Downloads</h3>
              <ul className="space-y-3">
                 {[
                   "Pronunciation Cheat Sheet",
                   "100 Most Common Verbs",
                   "Conversation Starters",
                   "Community Playlist"
                 ].map(link => (
                   <li key={link}>
                     <a href="#" className="flex items-center text-muted-foreground hover:text-primary transition-colors text-sm group">
                       <FileText className="w-4 h-4 mr-2 group-hover:text-accent" />
                       {link}
                       <Download className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
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
