import Layout from "@/components/layout/Layout";
import { Heart, Shield, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/large_diverse_community_group_celebrating_outdoors.png";

export default function Community() {
  return (
    <Layout>
      <div className="relative py-20 md:py-28 bg-blue-600 overflow-hidden min-h-[480px] flex items-center">
         <div className="absolute inset-0 z-0">
           <img 
             src={heroImage} 
             className="w-full h-full object-cover opacity-30 mix-blend-luminosity" 
             alt="Community celebration" 
             loading="eager"
             fetchPriority="high"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-transparent" />
         </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block p-3 rounded-full bg-white/10 backdrop-blur-md mb-6 animate-bounce duration-[2000ms]">
             <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 text-white drop-shadow-lg">
            Our Community
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-blue-50 font-medium leading-relaxed">
            A safe, encouraging circle where you’re not judged for mistakes.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-20">
        
        {/* Values Grid */}
        <div className="grid md:grid-cols-2 gap-16 mb-20">
          <div className="space-y-8">
            <h2 className="text-4xl font-heading font-bold text-primary">What we believe</h2>
            <div className="space-y-6">
              {[
                { title: "Welcome first", desc: "Everyone belongs here, regardless of level or background.", color: "bg-yellow-500" },
                { title: "Progress over perfection", desc: "Mistakes are proof that you are trying.", color: "bg-blue-500" },
                { title: "Practice together", desc: "Language is for connecting with people, not just passing tests.", color: "bg-green-500" },
                { title: "Respect always", desc: "We treat every person with dignity and kindness.", color: "bg-orange-500" }
              ].map((val, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className={`w-14 h-14 rounded-2xl ${val.color} flex items-center justify-center shrink-0 text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform rotate-3 group-hover:rotate-0`}>
                    {i + 1}
                  </div>
                  <div className="pt-2">
                    <h3 className="font-heading font-bold text-xl mb-1 text-foreground">{val.title}</h3>
                    <p className="text-muted-foreground font-medium">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-slate-50 p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full" />
             
             <h3 className="text-3xl font-heading font-bold mb-8 flex items-center gap-3 text-foreground">
               <Shield className="w-8 h-8 text-primary" /> Community Rules
             </h3>
             <ul className="space-y-5 relative z-10">
               {[
                 "Be kind and respectful at all times.",
                 "No bullying, teasing, or harassment.",
                 "Keep messages on-topic (English + encouragement).",
                 "No private messaging minors (safety rule).",
                 "If you need help, contact a facilitator."
               ].map((rule, i) => (
                 <li key={i} className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-primary/30 transition-colors">
                   <div className="w-2 h-2 rounded-full bg-green-500 mt-2.5 shrink-0" />
                   <span className="text-foreground/90 font-medium text-lg leading-snug">{rule}</span>
                 </li>
               ))}
             </ul>
          </div>
        </div>

        {/* Safe Space Note */}
        <div className="bg-yellow-50 rounded-[3rem] p-10 md:p-20 text-center max-w-5xl mx-auto border-2 border-yellow-100 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

           <div className="relative z-10">
             <Heart className="w-16 h-16 text-red-500 mx-auto mb-8 animate-pulse" />
             <h2 className="text-4xl font-heading font-bold mb-8 text-foreground">A Note on Faith & Culture</h2>
             <p className="text-xl text-foreground/70 font-medium leading-relaxed mb-10 max-w-3xl mx-auto">
               We are a community shaped by service and encouragement. Many of our volunteers are Christians, and we believe love should look practical. <br/><br/>
               <span className="text-foreground font-bold">However, English is open to everyone.</span> <br/>
               Faith conversations are always optional, respectful, and never forced. You are welcome here exactly as you are.
             </p>
           </div>
        </div>

      </div>
    </Layout>
  );
}
