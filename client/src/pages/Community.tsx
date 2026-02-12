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
          <div className="inline-block p-4 rounded-full bg-white/10 backdrop-blur-md mb-8 animate-bounce duration-[2000ms] shadow-lg border border-white/20">
             <Heart className="w-10 h-10 text-white fill-white drop-shadow-md" />
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-heading font-black mb-6 sm:mb-8 text-white drop-shadow-xl tracking-tight leading-[0.9]">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Community</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-3xl max-w-3xl mx-auto text-blue-50 font-bold leading-relaxed drop-shadow-md">
            A safe, encouraging circle where you’re not judged for mistakes.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        
        {/* Values Grid */}
        <div className="grid lg:grid-cols-2 gap-12 md:gap-20 mb-20 md:mb-32">
          <div className="space-y-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-primary tracking-tight">What we believe</h2>
            <div className="space-y-8">
              {[
                { title: "Welcome first", desc: "Everyone belongs here, regardless of level or background.", color: "bg-yellow-500 shadow-yellow-200" },
                { title: "Progress over perfection", desc: "Mistakes are proof that you are trying.", color: "bg-blue-500 shadow-blue-200" },
                { title: "Practice together", desc: "Language is for connecting with people, not just passing tests.", color: "bg-green-500 shadow-green-200" },
                { title: "Respect always", desc: "We treat every person with dignity and kindness.", color: "bg-orange-500 shadow-orange-200" }
              ].map((val, i) => (
                <div key={i} className="flex gap-4 sm:gap-6 md:gap-8 group">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl sm:rounded-3xl ${val.color} flex items-center justify-center shrink-0 text-white font-black text-xl sm:text-2xl md:text-3xl shadow-xl group-hover:scale-110 transition-transform rotate-3 group-hover:rotate-0`}>
                    {i + 1}
                  </div>
                  <div className="pt-1 sm:pt-2">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl mb-1 sm:mb-2 text-foreground group-hover:text-primary transition-colors">{val.title}</h3>
                    <p className="text-muted-foreground font-medium text-base sm:text-lg leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-slate-50 p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-[3rem] border border-slate-200 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-bl-[4rem] transition-transform group-hover:scale-125 duration-700" />

             <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-6 sm:mb-10 flex items-center gap-3 sm:gap-4 text-foreground">
               <Shield className="w-10 h-10 text-primary fill-primary/10" /> Community Rules
             </h3>
             <ul className="space-y-4 relative z-10">
               {[
                 "Be kind and respectful at all times.",
                 "No bullying, teasing, or harassment.",
                 "Keep messages on-topic (English + encouragement).",
                 "No private messaging minors (safety rule).",
                 "If you need help, contact a facilitator."
               ].map((rule, i) => (
                 <li key={i} className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all group/item">
                   <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-2.5 shrink-0 group-hover/item:scale-125 transition-transform" />
                   <span className="text-foreground/90 font-medium text-lg leading-snug">{rule}</span>
                 </li>
               ))}
             </ul>
          </div>
        </div>

        {/* Safe Space Note */}
        <div className="bg-yellow-50 rounded-2xl sm:rounded-[3rem] p-6 sm:p-10 md:p-20 text-center max-w-5xl mx-auto border-2 border-yellow-100 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

           <div className="relative z-10">
             <Heart className="w-12 sm:w-16 h-12 sm:h-16 text-red-500 mx-auto mb-6 sm:mb-8 animate-pulse" />
             <h2 className="text-2xl sm:text-4xl font-heading font-bold mb-6 sm:mb-8 text-foreground">A Note on Faith & Culture</h2>
             <p className="text-base sm:text-xl text-foreground/70 font-medium leading-relaxed mb-8 sm:mb-10 max-w-3xl mx-auto">
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
