import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'pt';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    // Nav
    "nav.home": "Home",
    "nav.cohorts": "Cohorts",
    "nav.resources": "Resources",
    "nav.events": "English Café",
    "nav.community": "Community",
    "nav.dashboard": "My Cohort",
    "nav.join": "Join Now",
    
    // Home Hero
    "home.hero.badge": "New Cohorts starting soon in Brasília",
    "home.hero.title.speak": "Speak.",
    "home.hero.title.connect": "Connect.",
    "home.hero.title.grow": "Grow.",
    "home.hero.subtitle": "A friendly place to practice English with real people—online during the week, and in Brasília through English Café meetups.",
    "home.hero.btn.cohort": "Join a Cohort",
    "home.hero.btn.cafe": "Join English Café",
    "home.hero.join_count": "Join 200+ learners in our community",
    "home.hero.safe_space": "Safe Space",
    "home.hero.testimonial": "\"I finally spoke without feeling judged!\"",

    // How it works
    "home.how.title": "How it works",
    "home.how.subtitle": "We’ve designed a simple rhythm to help you improve without overwhelming your schedule.",
    "home.how.step1.title": "Join a cohort",
    "home.how.step1.desc": "Pick a track that fits your level and schedule. Small groups, friendly vibes.",
    "home.how.step2.title": "Practice together",
    "home.how.step2.desc": "Use simple daily prompts and voice notes to build a habit of speaking.",
    "home.how.step3.title": "Speak with confidence",
    "home.how.step3.desc": "Join weekly Conversation Circles and meetups to use what you learned.",

    // About
    "home.about.mission": "Our Mission",
    "home.about.title": "About Us",
    "home.about.p1": "Horizonte English Community exists to help people grow in confidence and opportunity through English.",
    "home.about.p2": "We are a community shaped by service and encouragement. Many of our volunteers are Christians, and we believe love should look practical. English is open to everyone, and faith conversations are always optional and respectful.",
    "home.about.faq.title": "Do I have to be Christian?",
    "home.about.faq.desc": "No. Everyone is welcome. Our English community is open to all backgrounds and beliefs.",
    "home.about.values": "Read our Community Values",

    // CTA
    "home.cta.title": "Ready to start your journey?",
    "home.cta.subtitle": "Join a supportive community where mistakes are just part of the process.",
    "home.cta.btn.browse": "Browse Cohorts",
    "home.cta.btn.free": "Try a Free Lesson",

    // Footer
    "footer.desc": "A friendly place to practice English with real people—online during the week, and in Brasília through English Café meetups.",
    "footer.col.community": "Community",
    "footer.col.resources": "Resources",
    "footer.col.connect": "Connect",
    "footer.link.cohorts": "Join a Cohort",
    "footer.link.cafe": "English Café",
    "footer.link.rules": "Community Rules",
    "footer.link.free": "Free Lessons",
    "footer.link.guide": "Student Guide",
    "footer.link.faq": "FAQ",
    "footer.powered": "Powered by",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.rights": "© 2026 Horizonte English Community. All rights reserved.",
  },
  pt: {
    // Nav
    "nav.home": "Início",
    "nav.cohorts": "Turmas",
    "nav.resources": "Recursos",
    "nav.events": "English Café",
    "nav.community": "Comunidade",
    "nav.dashboard": "Minha Turma",
    "nav.join": "Entrar Agora",
    
    // Home Hero
    "home.hero.badge": "Novas turmas começando em Brasília",
    "home.hero.title.speak": "Fale.",
    "home.hero.title.connect": "Conecte-se.",
    "home.hero.title.grow": "Cresça.",
    "home.hero.subtitle": "Um lugar amigável para praticar inglês com pessoas reais — online durante a semana e em Brasília através dos encontros do English Café.",
    "home.hero.btn.cohort": "Entrar em uma Turma",
    "home.hero.btn.cafe": "Participar do English Café",
    "home.hero.join_count": "Junte-se a mais de 200 alunos",
    "home.hero.safe_space": "Espaço Seguro",
    "home.hero.testimonial": "\"Finalmente falei sem me sentir julgado!\"",

    // How it works
    "home.how.title": "Como funciona",
    "home.how.subtitle": "Criamos um ritmo simples para ajudar você a melhorar sem sobrecarregar sua agenda.",
    "home.how.step1.title": "Entre em uma turma",
    "home.how.step1.desc": "Escolha uma trilha que se adapte ao seu nível e horário. Pequenos grupos, clima amigável.",
    "home.how.step2.title": "Pratique juntos",
    "home.how.step2.desc": "Use prompts diários simples e áudios para criar o hábito de falar.",
    "home.how.step3.title": "Fale com confiança",
    "home.how.step3.desc": "Participe de Círculos de Conversação semanais e encontros para usar o que aprendeu.",

    // About
    "home.about.mission": "Nossa Missão",
    "home.about.title": "Sobre Nós",
    "home.about.p1": "A Comunidade Horizonte English existe para ajudar pessoas a crescer em confiança e oportunidades através do inglês.",
    "home.about.p2": "Somos uma comunidade moldada pelo serviço e encorajamento. Muitos de nossos voluntários são cristãos, e acreditamos que o amor deve ser prático. O inglês é aberto a todos, e conversas sobre fé são sempre opcionais e respeitosas.",
    "home.about.faq.title": "Preciso ser cristão?",
    "home.about.faq.desc": "Não. Todos são bem-vindos. Nossa comunidade de inglês está aberta a todas as origens e crenças.",
    "home.about.values": "Leia nossos Valores da Comunidade",

    // CTA
    "home.cta.title": "Pronto para começar?",
    "home.cta.subtitle": "Junte-se a uma comunidade de apoio onde erros são apenas parte do processo.",
    "home.cta.btn.browse": "Ver Turmas",
    "home.cta.btn.free": "Experimente uma Aula Grátis",

    // Footer
    "footer.desc": "Um lugar amigável para praticar inglês com pessoas reais — online durante a semana e em Brasília através dos encontros do English Café.",
    "footer.col.community": "Comunidade",
    "footer.col.resources": "Recursos",
    "footer.col.connect": "Conectar",
    "footer.link.cohorts": "Entrar em uma Turma",
    "footer.link.cafe": "English Café",
    "footer.link.rules": "Regras da Comunidade",
    "footer.link.free": "Aulas Gratuitas",
    "footer.link.guide": "Guia do Aluno",
    "footer.link.faq": "FAQ",
    "footer.powered": "Oferecido por",
    "footer.privacy": "Política de Privacidade",
    "footer.terms": "Termos de Uso",
    "footer.rights": "© 2026 Horizonte English Community. Todos os direitos reservados.",
  }
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
