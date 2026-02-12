import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Clock, Coffee, Briefcase, Gamepad, MessageCircle, Map, Sun, Loader2, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@assets/generated_images/bright_sunny_outdoor_cafe_in_brazil.png";

function RsvpForm({ eventId, maxSpots }: { eventId: number; maxSpots: number | null }) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ fullName, email, phone: phone || null, eventId }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        toast({ title: "RSVP confirmed!", description: "We'll see you there!" });
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setSubmitted(false); setFullName(""); setEmail(""); setPhone(""); } }}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full h-16 text-xl rounded-full bg-green-600 hover:bg-green-700 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all font-bold" data-testid="button-rsvp">
          RSVP Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold" data-testid="text-rsvp-title">
            {submitted ? "You're In!" : "RSVP for English Café"}
          </DialogTitle>
          <DialogDescription>
            {submitted ? "We've saved your spot. See you there!" : "Reserve your spot at the next meetup."}
          </DialogDescription>
        </DialogHeader>
        {submitted ? (
          <div className="flex flex-col items-center py-8 gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-center text-muted-foreground font-medium">Look for the "Horizonte" sign when you arrive!</p>
            <Button onClick={() => setOpen(false)} className="rounded-full px-8" data-testid="button-close-rsvp">Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rsvpName" className="font-bold text-sm">Full Name *</Label>
              <Input id="rsvpName" data-testid="input-rsvp-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Your name" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rsvpEmail" className="font-bold text-sm">Email *</Label>
              <Input id="rsvpEmail" data-testid="input-rsvp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rsvpPhone" className="font-bold text-sm">Phone / WhatsApp</Label>
              <Input id="rsvpPhone" data-testid="input-rsvp-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+55 61 99999-9999" className="h-11 rounded-xl" />
            </div>
            <Button type="submit" disabled={submitting} className="w-full h-12 rounded-xl font-bold text-lg shadow-lg bg-green-600 hover:bg-green-700" data-testid="button-rsvp-submit">
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm RSVP"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function Events() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["/api/events"],
    queryFn: async () => {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
  });

  const nextEvent = events?.[0];

  return (
    <Layout>
      <div className="relative py-20 md:py-28 bg-foreground text-background overflow-hidden min-h-[480px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            className="w-full h-full object-cover opacity-40" 
            alt="Outdoor cafe" 
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/80 to-yellow-500/60 mix-blend-multiply" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-white font-bold text-sm mb-6 uppercase tracking-wider border border-white/20 shadow-lg">
            <Sun className="w-4 h-4 text-yellow-300" />
            In-Person Meetups
          </div>
          <h1 className="text-6xl md:text-8xl font-heading font-black mb-6 text-white drop-shadow-xl tracking-tighter leading-[0.9]">
            English Café <br className="hidden md:block"/> <span className="text-yellow-300">Brasília</span>
          </h1>
          <p className="text-xl md:text-3xl text-white/90 font-bold max-w-2xl mx-auto drop-shadow-md leading-relaxed">
            Social practice, friendships, and low-pressure speaking. <br/>
            <span className="text-yellow-200 bg-white/10 px-2 rounded-lg">Coffee is on us!</span>
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16 md:py-20 -mt-10 md:-mt-16 relative z-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
           <div>
             <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl mb-12 border border-slate-100">
               <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-foreground">What to expect</h2>
               <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
                 Our Café meets follow a "station" format so you never feel stuck or awkward. Move around, meet new people, and practice different topics.
               </p>
             </div>

             <div className="grid sm:grid-cols-1 gap-5">
               {[
                 { 
                   title: "Introductions Station", 
                   desc: "Easy icebreakers for new faces. Great place to start if it's your first time.",
                   icon: <MessageCircle className="w-6 h-6 text-blue-600" />,
                   bg: "bg-blue-50 border-blue-100"
                 },
                 { 
                   title: "City Life Station", 
                   desc: "Talk about Brasília, favorite spots, and local tips.",
                   icon: <Map className="w-6 h-6 text-green-600" />,
                   bg: "bg-green-50 border-green-100"
                 },
                 { 
                   title: "Work Talk Station", 
                   desc: "Practice professional networking and career conversations in a relaxed way.",
                   icon: <Briefcase className="w-6 h-6 text-purple-600" />,
                   bg: "bg-purple-50 border-purple-100"
                 },
                 { 
                   title: "Games Station (Confidence Builder)", 
                   desc: "Fun board games in English. The best way to forget you're learning!",
                   icon: <Gamepad className="w-6 h-6 text-orange-600" />,
                   bg: "bg-orange-50 border-orange-100"
                 },
                 { 
                   title: "Beginner Corner", 
                   desc: "A protected, slower-paced table with extra facilitator help. No pressure.",
                   icon: <Coffee className="w-6 h-6 text-amber-600" />,
                   bg: "bg-amber-50 border-amber-100"
                 }
               ].map((station, i) => (
                 <div key={i} className={`flex items-start gap-5 p-6 rounded-3xl border shadow-sm hover:shadow-lg transition-all hover:scale-[1.02] duration-300 ${station.bg} bg-white group`}>
                   <div className="p-4 bg-white rounded-2xl shrink-0 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                     {station.icon}
                   </div>
                   <div>
                     <h3 className="font-heading font-bold text-xl mb-1.5 text-foreground">{station.title}</h3>
                     <p className="text-base text-foreground/70 leading-relaxed font-medium">{station.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>

           <div className="space-y-8">
             <div className="bg-white rounded-[2.5rem] shadow-2xl border-2 border-slate-100 p-8 md:p-12 sticky top-24">
                <div className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-wider mb-6">Upcoming</div>
                <h3 className="text-4xl font-heading font-bold mb-8 text-foreground">Next Meetup</h3>
                
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : nextEvent ? (
                  <>
                    <div className="space-y-8 mb-10">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                          <Calendar className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground font-bold uppercase tracking-wide">Date</p>
                          <p className="font-heading font-bold text-2xl text-foreground" data-testid="text-event-date">{nextEvent.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm">
                          <Clock className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground font-bold uppercase tracking-wide">Time</p>
                          <p className="font-heading font-bold text-2xl text-foreground" data-testid="text-event-time">{nextEvent.time}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shadow-sm">
                          <MapPin className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground font-bold uppercase tracking-wide">Location</p>
                          <p className="font-heading font-bold text-2xl text-foreground" data-testid="text-event-location">{nextEvent.location}</p>
                          {nextEvent.locationDetail && <p className="text-sm text-muted-foreground font-medium">{nextEvent.locationDetail}</p>}
                        </div>
                      </div>
                    </div>

                    <RsvpForm eventId={nextEvent.id} maxSpots={nextEvent.maxSpots} />
                    <p className="text-center text-sm text-muted-foreground mt-6 font-medium">
                      Limited to {nextEvent.maxSpots || 25} spots. Please RSVP early.
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No upcoming events right now. Check back soon!</p>
                )}
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
