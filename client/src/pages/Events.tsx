import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Coffee, Briefcase, Gamepad, MessageCircle, Map, Sun } from "lucide-react";
import heroImage from "@assets/generated_images/bright_sunny_outdoor_cafe_in_brazil.png";

export default function Events() {
  return (
    <Layout>
      <div className="relative py-24 bg-foreground text-background overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} className="w-full h-full object-cover opacity-40" alt="" />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/80 to-yellow-500/60 mix-blend-multiply" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white font-bold text-sm mb-6 uppercase tracking-wider border border-white/30">
            <Sun className="w-4 h-4 text-yellow-300" />
            In-Person Meetups
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 text-white drop-shadow-lg">
            English Café Brasília
          </h1>
          <p className="text-xl md:text-3xl text-white font-bold max-w-2xl mx-auto drop-shadow-md">
            Social practice, friendships, and low-pressure speaking. <br/>
            <span className="text-yellow-200">Coffee is on us!</span>
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-20 -mt-10 relative z-20">
        <div className="grid lg:grid-cols-2 gap-16">
           <div>
             <div className="bg-white rounded-3xl p-8 shadow-xl mb-12">
               <h2 className="text-3xl font-heading font-bold mb-6 text-foreground">What to expect</h2>
               <p className="text-lg text-muted-foreground font-medium">
                 Our Café meets follow a "station" format so you never feel stuck or awkward. Move around, meet new people, and practice different topics.
               </p>
             </div>

             <div className="grid sm:grid-cols-1 gap-4">
               {[
                 { 
                   title: "Introductions Station", 
                   desc: "Easy icebreakers for new faces. Great place to start if it's your first time.",
                   icon: <MessageCircle className="w-5 h-5 text-blue-600" />,
                   bg: "bg-blue-50 border-blue-100"
                 },
                 { 
                   title: "City Life Station", 
                   desc: "Talk about Brasília, favorite spots, and local tips.",
                   icon: <Map className="w-5 h-5 text-green-600" />,
                   bg: "bg-green-50 border-green-100"
                 },
                 { 
                   title: "Work Talk Station", 
                   desc: "Practice professional networking and career conversations in a relaxed way.",
                   icon: <Briefcase className="w-5 h-5 text-purple-600" />,
                   bg: "bg-purple-50 border-purple-100"
                 },
                 { 
                   title: "Games Station (Confidence Builder)", 
                   desc: "Fun board games in English. The best way to forget you're learning!",
                   icon: <Gamepad className="w-5 h-5 text-orange-600" />,
                   bg: "bg-orange-50 border-orange-100"
                 },
                 { 
                   title: "Beginner Corner", 
                   desc: "A protected, slower-paced table with extra facilitator help. No pressure.",
                   icon: <Coffee className="w-5 h-5 text-amber-600" />,
                   bg: "bg-amber-50 border-amber-100"
                 }
               ].map((station, i) => (
                 <div key={i} className={`flex items-start gap-4 p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all hover:scale-[1.01] ${station.bg} bg-white`}>
                   <div className="p-3 bg-white rounded-full shrink-0 shadow-sm border border-slate-100">
                     {station.icon}
                   </div>
                   <div>
                     <h3 className="font-bold text-lg mb-1 text-foreground">{station.title}</h3>
                     <p className="text-sm text-foreground/70 leading-relaxed font-medium">{station.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>

           <div className="space-y-8">
             <div className="bg-white rounded-[2.5rem] shadow-2xl border-2 border-slate-100 p-8 md:p-12 sticky top-24">
                <div className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-wider mb-6">Upcoming</div>
                <h3 className="text-4xl font-heading font-bold mb-8 text-foreground">Next Meetup</h3>
                
                <div className="space-y-8 mb-10">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                      <Calendar className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-bold uppercase tracking-wide">Date</p>
                      <p className="font-heading font-bold text-2xl text-foreground">Saturday, Jan 24th</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm">
                      <Clock className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-bold uppercase tracking-wide">Time</p>
                      <p className="font-heading font-bold text-2xl text-foreground">10:00 AM - 12:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shadow-sm">
                      <MapPin className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-bold uppercase tracking-wide">Location</p>
                      <p className="font-heading font-bold text-2xl text-foreground">Café da Cidade</p>
                      <p className="text-sm text-muted-foreground font-medium">Asa Norte, Brasília</p>
                    </div>
                  </div>
                </div>

                <Button size="lg" className="w-full h-16 text-xl rounded-full bg-green-600 hover:bg-green-700 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all font-bold">
                  RSVP on WhatsApp
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-6 font-medium">
                  Limited to 25 spots. Please RSVP early.
                </p>
             </div>
             
             <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-1 rounded-3xl shadow-lg">
                <div className="bg-white rounded-[20px] p-6 text-center">
                   <h4 className="font-bold text-lg mb-2 text-foreground">First time?</h4>
                   <p className="text-foreground/70 font-medium">
                     Don't worry about your level. Most people come alone! Look for the "Horizonte" sign on the table.
                   </p>
                </div>
             </div>
           </div>
        </div>
      </div>
    </Layout>
  );
}
