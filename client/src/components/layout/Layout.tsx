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
                 <img src={logoImage} alt="Horizonte Logo" className="w-full h-full object-cover" />
              </div>
              <span className={`font-heading font-bold text-xl tracking-tight transition-colors ${isScrolled ? "text-primary" : "text-primary"}`}>
                Horizonte
              </span>
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
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-6 mt-10">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <a className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  </Link>
                ))}
                
                <Button 
                  variant="outline"
                  onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
                  className="justify-start gap-3"
                >
                   <Globe className="w-5 h-5" />
                   {language === 'en' ? 'Mudar para Português' : 'Switch to English'}
                </Button>

                <Link href="/cohorts">
                  <Button className="w-full rounded-full bg-primary text-white">{t("nav.join")}</Button>
                </Link>
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
               <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-heading font-bold">H</div>
               <span className="font-heading font-bold text-lg">Horizonte</span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-xs">
              {t("footer.desc")}
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
              Brasília, DF, Brazil
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
                 <span className="font-medium text-foreground uppercase tracking-wider text-[10px]">{t("footer.powered")}</span>
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
