import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MessageCircle, Users, Coffee, Globe } from "lucide-react";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/diverse_group_of_people_talking_and_laughing_in_a_cafe.png";
import textureImage from "@assets/generated_images/soft_abstract_background_with_horizon_gradient.png";
import studentImage from "@assets/generated_images/young_woman_speaking_confidently_outdoors.png";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent-foreground font-medium text-sm border border-accent/20">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                New Cohorts starting soon in Brasília
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.1] text-foreground">
                Speak. <br/>
                <span className="text-primary">Connect.</span> <br/>
                Grow.
              </h1>
              
              <p className="text-xl text-muted-foreground md:max-w-md leading-relaxed">
                A friendly place to practice English with real people—online during the week, and in Brasília through English Café meetups.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/cohorts">
                  <Button size="lg" className="rounded-full text-lg h-14 px-8 bg-primary hover:bg-primary/90 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                    Join a Cohort
                  </Button>
                </Link>
                <Link href="/events">
                   <Button variant="outline" size="lg" className="rounded-full text-lg h-14 px-8 border-2 hover:bg-secondary/50 transition-colors">
                    Join English Café
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                       {/* Placeholder for avatars, or could use random mock avatars if we had them. Using colors for now */}
                       <div className={`w-full h-full bg-slate-${i * 200}`} />
                    </div>
                  ))}
                </div>
                <p>Join 200+ learners in our community</p>
              </div>
            </div>
            
            <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
              <div className="absolute -inset-4 bg-accent/20 rounded-full blur-3xl opacity-50" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src={heroImage} 
                  alt="Friends laughing at a coffee table" 
                  className="w-full h-full object-cover aspect-[4/3]"
                />
              </div>
              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-border/50 max-w-[200px] animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                 <div className="flex items-center gap-3 mb-2">
                   <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                     <MessageCircle size={16} />
                   </div>
                   <span className="font-bold text-sm">Safe Space</span>
                 </div>
                 <p className="text-xs text-muted-foreground">"I finally spoke without feeling judged!"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground text-lg">We’ve designed a simple rhythm to help you improve without overwhelming your schedule.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Join a cohort",
                desc: "Pick a track that fits your level and schedule. Small groups, friendly vibes.",
                icon: <Users className="w-6 h-6 text-primary" />
              },
              {
                step: "02",
                title: "Practice together",
                desc: "Use simple daily prompts and voice notes to build a habit of speaking.",
                icon: <MessageCircle className="w-6 h-6 text-accent" />
              },
              {
                step: "03",
                title: "Speak with confidence",
                desc: "Join weekly Conversation Circles and meetups to use what you learned.",
                icon: <Globe className="w-6 h-6 text-green-500" />
              }
            ].map((item, idx) => (
              <Card key={idx} className="border-none shadow-lg bg-secondary/30 relative overflow-hidden group hover:bg-secondary/50 transition-colors">
                <CardContent className="p-8">
                  <div className="absolute top-0 right-0 p-8 opacity-10 font-heading font-bold text-8xl leading-none select-none text-primary group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-primary">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={textureImage} className="w-full h-full object-cover opacity-20" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
               <div className="absolute -inset-4 bg-primary/10 rounded-full blur-3xl" />
               <img 
                 src={studentImage} 
                 alt="Student smiling" 
                 className="relative rounded-2xl shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform duration-500 w-full max-w-md mx-auto"
               />
            </div>
            
            <div className="order-1 md:order-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">About Us</h2>
              <div className="prose prose-lg text-muted-foreground">
                <p>
                  Horizonte English Community exists to help people grow in confidence and opportunity through English.
                </p>
                <p>
                  We are a community shaped by service and encouragement. Many of our volunteers are Christians, and we believe love should look practical. English is open to everyone, and faith conversations are always optional and respectful.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
                <h4 className="font-heading font-bold text-lg mb-2 text-foreground">Do I have to be Christian?</h4>
                <p className="text-muted-foreground">No. Everyone is welcome. Our English community is open to all backgrounds and beliefs.</p>
              </div>
              
              <div className="pt-4">
                 <Link href="/community">
                   <Button variant="link" className="text-primary font-bold p-0 h-auto hover:no-underline group">
                     Read our Community Values <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                   </Button>
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Ready to start your journey?</h2>
          <p className="text-primary-foreground/80 text-lg mb-10">
            Join a supportive community where mistakes are just part of the process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link href="/cohorts">
               <Button size="lg" className="rounded-full bg-white text-primary hover:bg-white/90 font-bold h-14 px-8 shadow-xl">
                 Browse Cohorts
               </Button>
             </Link>
             <Link href="/resources">
               <Button variant="outline" size="lg" className="rounded-full border-white/30 hover:bg-white/10 text-white h-14 px-8 backdrop-blur-sm">
                 Try a Free Lesson
               </Button>
             </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
