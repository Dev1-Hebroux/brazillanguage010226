import Layout from "@/components/layout/Layout";
import { Heart, Shield, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Community() {
  return (
    <Layout>
      <div className="bg-primary py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Our Community</h1>
          <p className="text-xl max-w-2xl mx-auto text-primary-foreground/90">
            A safe, encouraging circle where you’re not judged for mistakes.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-20">
        
        {/* Values Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="space-y-8">
            <h2 className="text-3xl font-heading font-bold text-primary">What we believe</h2>
            <div className="space-y-6">
              {[
                { title: "Welcome first", desc: "Everyone belongs here, regardless of level or background." },
                { title: "Progress over perfection", desc: "Mistakes are proof that you are trying." },
                { title: "Practice together", desc: "Language is for connecting with people, not just passing tests." },
                { title: "Respect always", desc: "We treat every person with dignity and kindness." }
              ].map((val, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0 text-accent-foreground font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{val.title}</h3>
                    <p className="text-muted-foreground">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-secondary/20 p-8 rounded-3xl border border-secondary/50">
             <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
               <Shield className="w-6 h-6 text-primary" /> Community Rules
             </h3>
             <ul className="space-y-4">
               {[
                 "Be kind and respectful at all times.",
                 "No bullying, teasing, or harassment.",
                 "Keep messages on-topic (English + encouragement).",
                 "No private messaging minors (safety rule).",
                 "If you need help, contact a facilitator."
               ].map((rule, i) => (
                 <li key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm">
                   <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                   <span className="text-foreground/90">{rule}</span>
                 </li>
               ))}
             </ul>
          </div>
        </div>

        {/* Safe Space Note */}
        <div className="bg-muted/30 rounded-3xl p-10 md:p-16 text-center max-w-4xl mx-auto">
           <Heart className="w-12 h-12 text-destructive mx-auto mb-6" />
           <h2 className="text-3xl font-heading font-bold mb-6">A Note on Faith & Culture</h2>
           <p className="text-lg text-muted-foreground leading-relaxed mb-8">
             We are a community shaped by service and encouragement. Many of our volunteers are Christians, and we believe love should look practical. <br/><br/>
             <strong>However, English is open to everyone.</strong> <br/>
             Faith conversations are always optional, respectful, and never forced. You are welcome here exactly as you are.
           </p>
        </div>

      </div>
    </Layout>
  );
}
