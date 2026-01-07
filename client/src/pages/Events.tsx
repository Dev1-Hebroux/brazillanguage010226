import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function Events() {
  return (
    <Layout>
      <div className="relative py-24 bg-foreground text-background overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <span className="text-accent font-bold tracking-wider uppercase text-sm mb-2 block">In-Person Meetups</span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">English Café Brasília</h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
            Social practice, friendships, and low-pressure speaking. Coffee is on us!
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16">
           <div>
             <h2 className="text-3xl font-heading font-bold mb-6 text-primary">What to expect</h2>
             <p className="text-lg text-muted-foreground mb-8">
               Our Café meets follow a "station" format so you never feel stuck or awkward. Move around, meet new people, and practice different topics.
             </p>

             <div className="grid sm:grid-cols-2 gap-6">
               {[
                 { title: "Introductions Station", desc: "Easy icebreakers for new faces." },
                 { title: "Games Station", desc: "Fun board games in English." },
                 { title: "Work Talk Station", desc: "Practice professional networking." },
                 { title: "Beginner Corner", desc: "Slower pace, extra help available." }
               ].map((station, i) => (
                 <div key={i} className="bg-secondary/20 p-6 rounded-2xl border border-secondary/50">
                   <h3 className="font-bold text-lg mb-2">{station.title}</h3>
                   <p className="text-sm text-muted-foreground">{station.desc}</p>
                 </div>
               ))}
             </div>
           </div>

           <div className="bg-white rounded-3xl shadow-xl border border-border p-8 md:p-10 h-fit">
              <h3 className="text-2xl font-heading font-bold mb-6">Next Meetup</h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-bold text-lg">Saturday, January 24th</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-bold text-lg">10:00 AM - 12:00 PM</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-bold text-lg">Café da Cidade, Asa Norte</p>
                  </div>
                </div>
              </div>

              <Button className="w-full h-14 text-lg rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg">
                RSVP on WhatsApp
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-4">
                Limited to 25 spots. Please RSVP early.
              </p>
           </div>
        </div>
      </div>
    </Layout>
  );
}
