import { Link, useLocation } from "wouter";
import { Menu, X, Instagram, Heart, ExternalLink, Globe, LogIn, LogOut, User, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logoImage from "@assets/generated_images/minimalist_logo_with_horizon_line_and_rising_arc.png";
import rccgLogo from "@assets/image_1767817496066.png";
import { useLanguage } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { SOCIAL_LINKS, LEGAL_LINKS } from "@/lib/config";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdminOrTrainer = user?.role === "admin" || user?.role === "trainer";

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/cohorts", label: t("nav.cohorts") },
    { href: "/resources", label: t("nav.resources") },
    { href: "/events", label: t("nav.events") },
    { href: "/community", label: t("nav.community") },
    { href: "/dashboard", label: t("nav.dashboard") },
    ...(isAdminOrTrainer ? [{ href: "/admin", label: "Admin" }] : []),
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
          <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center">
                 <img src={logoImage} alt="Horizonte Café Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className={`font-heading font-bold text-xl tracking-tight leading-none transition-colors ${isScrolled ? "text-primary" : "text-primary"}`}>
                  Horizonte Café
                </span>
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">English for Impact</span>
              </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-accent ${
                    location === link.href
                      ? "text-primary font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
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
              {language === 'en' ? 'EN' : 'PT'}
            </Button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center" data-testid="text-username">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="hidden lg:inline">{user.username}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="text-muted-foreground hover:text-foreground"
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button size="sm" className="rounded-full px-6 bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all" data-testid="button-signin">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
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
                    <Link key={link.href} href={link.href} className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                        location === link.href 
                          ? "bg-primary/10 text-primary font-bold shadow-sm" 
                          : "text-foreground/80 hover:bg-muted hover:text-foreground font-medium"
                      }`}>
                        <span className="text-lg">{link.label}</span>
                        {location === link.href && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
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
                     {language === 'en' ? 'Switch to Português' : 'Mudar para English'}
                  </Button>

                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-bold text-foreground">{user.username}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={logout}
                        className="w-full rounded-xl h-12 font-bold text-lg transition-all"
                        data-testid="button-mobile-logout"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Link href="/auth">
                      <Button className="w-full rounded-xl h-12 bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98]" data-testid="button-mobile-signin">
                        <LogIn className="w-4 h-4 mr-2" /> Sign In
                      </Button>
                    </Link>
                  )}
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
      <footer className="bg-primary text-primary-foreground pt-10 sm:pt-16 mt-12 sm:mt-20">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pb-12 md:pb-16">
          <div className="space-y-4 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-heading font-bold">E</div>
               <span className="font-heading font-bold text-lg">English for Impact</span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-xs">
              Horizonte cafe. Home of English for impact - A free English class initiative of the RCCG Brazil. Speak.Connect.Grow
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-6">{t("footer.col.community")}</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li><Link href="/cohorts" className="hover:text-white transition-colors">{t("footer.link.cohorts")}</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">{t("footer.link.cafe")}</Link></li>
              <li><Link href="/community" className="hover:text-white transition-colors">{t("footer.link.rules")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-6">{t("footer.col.resources")}</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li><Link href="/resources" className="hover:text-white transition-colors">{t("footer.link.free")}</Link></li>
              <li><Link href="/resources" className="hover:text-white transition-colors">{t("footer.link.guide")}</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">{t("footer.link.faq")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-6">{t("footer.col.connect")}</h4>
            <div className="flex gap-4 mb-4">
              {SOCIAL_LINKS.instagram && (
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
            </div>
            <p className="text-xs text-primary-foreground/60">
              Loja 1A, situada no 1º subsolo do Edifício Centro Comercial Boulevard no SDS - Brasília - DF.
            </p>
          </div>
        </div>

        {/* Powered By Section */}
        <div className="bg-white py-4 sm:py-6">
          <div className="container mx-auto px-4 md:px-6">
             <div className="flex flex-col items-center gap-3 sm:gap-4 text-xs text-muted-foreground md:flex-row md:justify-between">

               {/* Left: Attribution */}
               <a
                 href="https://rccgsouthamerica.org/"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex items-center gap-2 sm:gap-3 group transition-opacity hover:opacity-80"
               >
                 <span className="font-medium text-foreground uppercase tracking-wider text-[10px] text-center sm:text-left">An initiative of RCCG, Hallelujah House of Praise, Brasília</span>
                 <img src={rccgLogo} alt="The Redeemed Christian Church of God Brazil" className="h-6 sm:h-8 w-auto shrink-0" />
                 <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
               </a>

               {/* Right: Legal */}
               <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                 <p>{t("footer.rights")}</p>
                 {LEGAL_LINKS.privacy && (
                   <a href={LEGAL_LINKS.privacy} className="hover:text-foreground transition-colors">{t("footer.privacy")}</a>
                 )}
                 {LEGAL_LINKS.terms && (
                   <a href={LEGAL_LINKS.terms} className="hover:text-foreground transition-colors">{t("footer.terms")}</a>
                 )}
               </div>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
