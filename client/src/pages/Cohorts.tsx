import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar, Clock, MapPin } from "lucide-react";

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
    color: "bg-blue-100 text-blue-800"
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
    color: "bg-orange-100 text-orange-800"
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
    color: "bg-green-100 text-green-800"
  }
];

export default function Cohorts() {
  return (
    <Layout>
      <div className="bg-secondary/30 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary">Find Your Track</h1>
          <p className="text-xl text-muted-foreground">
            Whether you're just starting or looking to build confidence, we have a friendly group for you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {tracks.map((track) => (
            <Card key={track.id} className="flex flex-col border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <Badge className={`w-fit mb-4 ${track.color} border-none`}>{track.level}</Badge>
                <CardTitle className="text-2xl font-heading font-bold">{track.title}</CardTitle>
                <CardDescription className="text-base mt-2">{track.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-6">
                <ul className="space-y-3">
                  {track.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="w-5 h-5 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>8 Week Program</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     {track.schedule.includes("In-Person") ? <MapPin className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                     <span>{track.schedule}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full rounded-full text-lg h-12 bg-primary hover:bg-primary/90">
                  Apply for {track.title.split(":")[0]}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Youth Section */}
        <div className="mt-20 bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10">
          <div className="md:flex items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-2xl font-heading font-bold">Looking for Youth Programs?</h3>
              <p className="text-muted-foreground">
                We have dedicated tracks for learners under 18, featuring more structure, shorter activities, and strong safeguarding rules to ensure a safe learning environment.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Button variant="outline" size="lg" className="rounded-full bg-white border-primary/20 hover:border-primary text-primary">
                View Youth Cohorts
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
