import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MessageCircle, Users, Coffee, Globe } from "lucide-react";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/vibrant_brazilian_street_scene_with_happy_diverse_people.png";
import textureImage from "@assets/generated_images/brasilia_modernist_architecture_under_blue_sky.png";
import studentImage from "@assets/generated_images/young_woman_speaking_confidently_outdoors.png";
import { useLanguage } from "@/lib/i18n";

export default function Home() {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-24 md:pb-32 overflow-hidden bg-gradient-to-br from-background via-white to-secondary/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
              <div className="absolute -left-20 -top-20 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-foreground font-bold text-sm border border-white/20 shadow-lg ring-1 ring-black/5 hover:scale-105 transition-transform cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                {t("home.hero.badge")}
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-heading font-black leading-[0.95] tracking-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-blue-800 drop-shadow-sm">
                  {t("home.hero.title.speak")}
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-br from-green-500 to-emerald-700 drop-shadow-sm ml-4 md:ml-12">
                  {t("home.hero.title.connect")}
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-orange-500 drop-shadow-sm ml-8 md:ml-24 relative">
                  {t("home.hero.title.grow")}
                  <svg className="absolute -bottom-4 -right-8 w-24 h-24 text-yellow-400/30 -z-10" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 0 L61 35 L97 35 L68 57 L79 91 L50 70 L21 91 L32 57 L3 35 L39 35 Z" />
                  </svg>
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-foreground/80 font-medium md:max-w-lg leading-relaxed drop-shadow-sm bg-white/30 backdrop-blur-sm p-4 rounded-2xl border border-white/40">
                {t("home.hero.subtitle")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/cohorts">
                  <Button size="lg" className="rounded-full text-lg h-16 px-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 font-bold border-2 border-white/20">
                    {t("home.hero.btn.cohort")}
                  </Button>
                </Link>
                <Link href="/events">
                   <Button variant="outline" size="lg" className="rounded-full text-lg h-16 px-10 bg-white/50 backdrop-blur-md border-2 border-white hover:bg-white text-foreground hover:text-primary transition-all font-bold shadow-lg">
                    {t("home.hero.btn.cafe")}
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-4 text-sm font-bold text-foreground/70 pt-4 bg-white/20 backdrop-blur-sm p-3 rounded-full w-fit border border-white/30">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden shadow-md ring-2 ring-white/50">
                       <div className={`w-full h-full bg-gradient-to-tr from-blue-400 via-green-400 to-yellow-400 opacity-80`} />
                    </div>
                  ))}
                </div>
                <p className="pr-2">{t("home.hero.join_count")}</p>
              </div>
            </div>
            
            <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-400/30 to-blue-400/30 rounded-full blur-3xl opacity-70" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white rotate-2 hover:rotate-0 transition-transform duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <img 
                  src={heroImage} 
                  alt="Friends laughing at a coffee table" 
                  className="w-full h-full object-cover aspect-[4/3] transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-xl shadow-xl border border-yellow-100 max-w-[220px] animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 z-20">
                 <div className="flex items-center gap-3 mb-2">
                   <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center shadow-inner">
                     <MessageCircle size={20} />
                   </div>
                   <span className="font-bold text-base text-foreground">{t("home.hero.safe_space")}</span>
                 </div>
                 <p className="text-sm font-medium text-muted-foreground">{t("home.hero.testimonial")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-foreground">{t("home.how.title")}</h2>
            <p className="text-foreground/70 text-lg font-medium">{t("home.how.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: t("home.how.step1.title"),
                desc: t("home.how.step1.desc"),
                icon: <Users className="w-8 h-8 text-white" />,
                color: "bg-blue-600"
              },
              {
                step: "02",
                title: t("home.how.step2.title"),
                desc: t("home.how.step2.desc"),
                icon: <MessageCircle className="w-8 h-8 text-white" />,
                color: "bg-yellow-500"
              },
              {
                step: "03",
                title: t("home.how.step3.title"),
                desc: t("home.how.step3.desc"),
                icon: <Globe className="w-8 h-8 text-white" />,
                color: "bg-green-600"
              }
            ].map((item, idx) => (
              <Card key={idx} className="border-none shadow-xl bg-white relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                <div className={`absolute top-0 left-0 w-full h-2 ${item.color}`} />
                <CardContent className="p-8">
                  <div className="absolute top-4 right-4 opacity-10 font-heading font-bold text-9xl leading-none select-none text-foreground group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <div className={`w-16 h-16 rounded-2xl ${item.color} shadow-lg flex items-center justify-center mb-8 transform group-hover:rotate-6 transition-transform`}>
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-heading font-bold mb-4 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 relative overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-0">
          <img src={textureImage} className="w-full h-full object-cover opacity-10 grayscale hover:grayscale-0 transition-all duration-1000" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
               <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl" />
               <img 
                 src={studentImage} 
                 alt="Student smiling" 
                 className="relative rounded-2xl shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform duration-500 w-full max-w-md mx-auto border-4 border-white"
               />
               <div className="absolute -bottom-6 -right-6 bg-accent p-6 rounded-full shadow-lg animate-bounce duration-[3000ms]">
                 <span className="text-3xl">🇧🇷</span>
               </div>
            </div>
            
            <div className="order-1 md:order-2 space-y-6">
              <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-lg font-bold text-sm mb-2">{t("home.about.mission")}</div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary">{t("home.about.title")}</h2>
              <div className="prose prose-lg text-foreground/80 font-medium">
                <p>
                  {t("home.about.p1")}
                </p>
                <p>
                  {t("home.about.p2")}
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl border-l-4 border-accent shadow-md">
                <h4 className="font-heading font-bold text-xl mb-3 text-foreground">{t("home.about.faq.title")}</h4>
                <p className="text-foreground/80 font-medium text-lg">{t("home.about.faq.desc")}</p>
              </div>
              
              <div className="pt-4">
                 <Link href="/community">
                   <Button variant="link" className="text-primary font-bold text-lg p-0 h-auto hover:no-underline group">
                     {t("home.about.values")} <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform text-accent" />
                   </Button>
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-green-500/20 to-transparent"></div>
        
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8 text-white drop-shadow-md">{t("home.cta.title")}</h2>
          <p className="text-white/90 text-xl md:text-2xl mb-12 font-medium max-w-2xl mx-auto">
            {t("home.cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <Link href="/cohorts">
               <Button size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold h-16 px-10 text-lg shadow-xl hover:scale-105 transition-transform">
                 {t("home.cta.btn.browse")}
               </Button>
             </Link>
             <Link href="/resources">
               <Button variant="outline" size="lg" className="rounded-full border-2 border-white/40 hover:bg-white/10 text-white h-16 px-10 text-lg backdrop-blur-sm font-bold">
                 {t("home.cta.btn.free")}
               </Button>
             </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
