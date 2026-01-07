import { Link, useLocation } from "wouter";
import { Menu, X, Instagram, Heart, ExternalLink, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logoImage from "@assets/generated_images/minimalist_logo_with_horizon_line_and_rising_arc.png";
import rccgLogo from "@assets/image_1767817496066.png";
import { useLanguage } from "@/lib/i18n";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/cohorts", label: t("nav.cohorts") },
    { href: "/resources", label: t("nav.resources") },
    { href: "/events", label: t("nav.events") },
    { href: "/community", label: t("nav.community") },
    { href: "/dashboard", label: t("nav.dashboard") },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center">
                 <img src={logoImage} alt="Horizonte Café Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className={`font-heading font-bold text-xl tracking-tight leading-none transition-colors ${isScrolled ? "text-primary" : "text-primary"}`}>
                  Horizonte Café
                </span>
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">English for Impact</span>
              </div>
            </a>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={`text-sm font-medium transition-colors hover:text-accent ${
                    location === link.href
                      ? "text-primary font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
            
            <div className="h-6 w-px bg-border mx-2" />
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
              className="font-bold flex items-center gap-2 hover:bg-primary/5"
            >
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'PT' : 'EN'}
            </Button>

            <Link href="/cohorts">
              <Button size="sm" className="rounded-full px-6 bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all">
                {t("nav.join")}
              </Button>
            </Link>
          </nav>

          {/* Mobile Nav */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden w-10 h-10 rounded-full hover:bg-muted/50">
                <Menu className="w-6 h-6 text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 border-r-0">
              <div className="flex flex-col h-full bg-background">
                
                {/* Header */}
                <div className="p-6 border-b border-border/50 bg-muted/10">
                   <div className="flex items-center gap-3 mb-2">
                     <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-heading font-bold text-xl shadow-md">
                       H
                     </div>
                     <span className="font-heading font-bold text-xl tracking-tight text-foreground">Horizonte Café</span>
                   </div>
                   <p className="text-xs text-muted-foreground font-medium pl-1">Home of English for Impact</p>
                </div>

                {/* Links */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <a className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                        location === link.href 
                          ? "bg-primary/10 text-primary font-bold shadow-sm" 
                          : "text-foreground/80 hover:bg-muted hover:text-foreground font-medium"
                      }`}>
                        {/* Icons could be added here if we mapped them */}
                        <span className="text-lg">{link.label}</span>
                        {location === link.href && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                      </a>
                    </Link>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-border/50 bg-muted/10 space-y-4">
                  <Button 
                    variant="outline"
                    onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
                    className="w-full justify-start gap-3 h-12 rounded-xl border-border/60 hover:bg-background hover:text-foreground font-medium"
                  >
                     <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Globe className="w-4 h-4 text-foreground/70" />
                     </div>
                     {language === 'en' ? 'Mudar para Português' : 'Switch to English'}
                  </Button>

                  <Link href="/cohorts">
                    <Button className="w-full rounded-xl h-12 bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98]">
                      {t("nav.join")}
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground pt-16 mt-20">
        <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-4 gap-12 pb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-heading font-bold">E</div>
               <span className="font-heading font-bold text-lg">English for Impact</span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-xs">
              A free English class initiative empowering our community to speak with confidence.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-6">{t("footer.col.community")}</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li><Link href="/cohorts"><a className="hover:text-white transition-colors">{t("footer.link.cohorts")}</a></Link></li>
              <li><Link href="/events"><a className="hover:text-white transition-colors">{t("footer.link.cafe")}</a></Link></li>
              <li><Link href="/community"><a className="hover:text-white transition-colors">{t("footer.link.rules")}</a></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-6">{t("footer.col.resources")}</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li><Link href="/resources"><a className="hover:text-white transition-colors">{t("footer.link.free")}</a></Link></li>
              <li><Link href="/resources"><a className="hover:text-white transition-colors">{t("footer.link.guide")}</a></Link></li>
              <li><Link href="/faq"><a className="hover:text-white transition-colors">{t("footer.link.faq")}</a></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-6">{t("footer.col.connect")}</h4>
            <div className="flex gap-4 mb-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Heart className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-primary-foreground/60">
              Loja 1A, situada no 1º subsolo do Edifício Centro Comercial Boulevard no SDS - Brasília - DF.
            </p>
          </div>
        </div>

        {/* Powered By Section */}
        <div className="bg-white py-6">
          <div className="container mx-auto px-4 md:px-6">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
               
               {/* Left: Attribution */}
               <a 
                 href="https://rccgsouthamerica.org/" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="flex items-center gap-3 group transition-opacity hover:opacity-80"
               >
                 <span className="font-medium text-foreground uppercase tracking-wider text-[10px]">An initiative of RCCG, Hallelujah House of Praise, Brasília</span>
                 <img src={rccgLogo} alt="The Redeemed Christian Church of God Brazil" className="h-8 w-auto" />
                 <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
               </a>

               {/* Right: Legal */}
               <div className="flex gap-6">
                 <p>{t("footer.rights")}</p>
                 <a href="#" className="hover:text-foreground transition-colors">{t("footer.privacy")}</a>
                 <a href="#" className="hover:text-foreground transition-colors">{t("footer.terms")}</a>
               </div>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
