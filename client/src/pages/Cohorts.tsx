import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar, Clock, MapPin } from "lucide-react";
import heroImage from "@assets/generated_images/diverse_group_of_happy_students_studying_outdoors_in_brazil.png";

const tracks = [
  {
    id: "foundations",
    title: "Track 1: Foundations",
    level: "Beginner",
    description: "Goal: Speak in simple sentences without fear.",
    features: [
      "Learn basic greetings and introductions",
      "Master simple daily routines",
      "Practice ordering food and asking directions",
      "Safe environment for first-time speakers"
    ],
    schedule: "Online • Tue/Thu 19:00",
    color: "bg-blue-100 text-blue-800",
    accent: "border-blue-200"
  },
  {
    id: "confidence",
    title: "Track 2: Confidence",
    level: "Low-Intermediate",
    description: "Goal: Speak longer, handle real-life situations, improve flow.",
    features: [
      "Handle work and travel conversations",
      "Improve pronunciation and flow",
      "Share opinions and stories",
      "Daily voice note feedback"
    ],
    schedule: "Online • Mon/Wed 20:00",
    color: "bg-yellow-100 text-yellow-800",
    accent: "border-yellow-200"
  },
  {
    id: "cafe",
    title: "Track 3: English Café",
    level: "Open Community",
    description: "Goal: Social practice, friendships, low-pressure speaking.",
    features: [
      "In-person meetups in Brasília",
      "Game nights and themed discussions",
      "Make new friends",
      "Coffee and good vibes"
    ],
    schedule: "In-Person • Saturdays 10:00",
    color: "bg-green-100 text-green-800",
    accent: "border-green-200"
  }
];

export default function Cohorts() {
  return (
    <Layout>
      <div className="relative py-24 bg-gradient-to-r from-blue-600 to-green-500 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img src={heroImage} className="w-full h-full object-cover opacity-20 mix-blend-overlay" alt="" />
           <div className="absolute inset-0 bg-black/10" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-3xl">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-sm mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            Applications Open for February 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-white drop-shadow-md">
            Find Your <span className="text-yellow-300">Track</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed drop-shadow-sm">
            Whether you're just starting or looking to build confidence, we have a friendly group for you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16 -mt-10 relative z-20">
        <div className="grid md:grid-cols-3 gap-8">
          {tracks.map((track) => (
            <Card key={track.id} className="flex flex-col border-none shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white overflow-hidden">
              <div className={`h-2 w-full ${track.color.split(" ")[0].replace("100", "500")}`} />
              <CardHeader>
                <Badge className={`w-fit mb-4 ${track.color} border-none font-bold text-sm px-3 py-1`}>{track.level}</Badge>
                <CardTitle className="text-2xl font-heading font-bold text-foreground">{track.title}</CardTitle>
                <CardDescription className="text-base mt-2 text-muted-foreground font-medium">{track.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-6">
                <ul className="space-y-3">
                  {track.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-foreground/80 font-medium">
                      <Check className="w-5 h-5 text-green-600 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 font-medium">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>8 Week Program</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                     {track.schedule.includes("In-Person") ? <MapPin className="w-4 h-4 text-primary" /> : <Clock className="w-4 h-4 text-primary" />}
                     <span>{track.schedule}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className={`w-full rounded-full text-lg h-12 font-bold shadow-md transition-transform active:scale-95 ${
                  track.id === 'foundations' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                  track.id === 'confidence' ? 'bg-yellow-500 hover:bg-yellow-600 text-black' :
                  'bg-green-600 hover:bg-green-700 text-white'
                }`}>
                  Apply for {track.title.split(":")[0]}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Youth Section */}
        <div className="mt-20 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-8 md:p-12 border border-yellow-200 shadow-inner">
          <div className="md:flex items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-3xl font-heading font-bold text-orange-900">Looking for Youth Programs?</h3>
              <p className="text-orange-800/80 font-medium text-lg">
                We have dedicated tracks for learners under 18, featuring more structure, shorter activities, and strong safeguarding rules to ensure a safe learning environment.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Button size="lg" className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg h-14 px-8">
                View Youth Cohorts
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
