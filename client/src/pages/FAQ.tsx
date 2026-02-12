import Layout from "@/components/layout/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/config";

const FAQ_SECTIONS = [
  {
    category: "General",
    questions: [
      {
        q: "What is Horizonte Café / English for Impact?",
        a: "We are a free English learning community based in Brasília, Brazil. Our mission is to provide accessible, high-quality English education through cohort-based courses, in-person café meetups, and online resources — all completely free of charge.",
      },
      {
        q: "Is this really free? What's the catch?",
        a: "Yes, everything is genuinely free. English for Impact is a community service initiative of RCCG (The Redeemed Christian Church of God), Hallelujah House of Praise, Brasília. We are funded by voluntary donations and staffed by passionate volunteers. There are no hidden fees, upsells, or catches.",
      },
      {
        q: "Do I need to be a Christian to join?",
        a: "Absolutely not. Our community is open to everyone regardless of faith, background, or nationality. While many of our volunteers are Christians, faith conversations are always optional, respectful, and never forced. You are welcome exactly as you are.",
      },
      {
        q: "What languages are supported for help/explanations?",
        a: "Activities and lessons are in English, but we provide bilingual support in Portuguese (BR) and Spanish (Latin America). You can switch the help language in our taster activities and resources.",
      },
    ],
  },
  {
    category: "Cohorts & Courses",
    questions: [
      {
        q: "What is a cohort?",
        a: "A cohort is a small group of learners (around 10-15 people) who go through an 8-week structured English course together. You'll have the same classmates throughout, which builds trust and makes practice more comfortable.",
      },
      {
        q: "What levels are available?",
        a: "We offer four tracks: A1 Beginner (just starting out), A2 Elementary (basic conversations), Intermediate (functional fluency), and Advanced (professional/academic contexts). Take our placement quiz on the Resources page to find your best fit.",
      },
      {
        q: "How do I apply for a cohort?",
        a: "Go to the Cohorts page, choose your level, and click 'Apply Now.' Fill in your details, and our team will review your application. You'll receive a confirmation and next steps via email or WhatsApp.",
      },
      {
        q: "What if I miss a week?",
        a: "Life happens! Each week's content is available in your student dashboard. While regular attendance helps build momentum, you can catch up on materials at your own pace. If you miss more than 2 consecutive weeks, please let your facilitator know.",
      },
      {
        q: "What happens after 8 weeks?",
        a: "After completing a cohort, you can move to the next level, repeat the same level for reinforcement, or become a community helper/facilitator. Many of our best volunteers started as students!",
      },
    ],
  },
  {
    category: "English Café Events",
    questions: [
      {
        q: "What is the English Café?",
        a: "Our English Café is a relaxed, in-person meetup where you can practice speaking English in a social setting. We use a 'station' format — you move between different themed tables (introductions, city life, work talk, games) so you never feel stuck.",
      },
      {
        q: "Do I need to RSVP?",
        a: "Yes, please RSVP through our Events page so we can prepare the right number of seats and refreshments. Spots are limited (usually 25) and fill up quickly!",
      },
      {
        q: "What if my English is very basic?",
        a: "We have a dedicated Beginner Corner with extra facilitator support and a slower pace. Many first-timers start there and gradually explore other stations. No pressure!",
      },
      {
        q: "Is coffee really free?",
        a: "Yes! Coffee (and sometimes snacks) are on us. It's our way of creating a welcoming, café-like atmosphere for practice.",
      },
    ],
  },
  {
    category: "Community & Safety",
    questions: [
      {
        q: "What are the community rules?",
        a: "Be kind and respectful at all times. No bullying, teasing, or harassment. Keep messages on-topic (English + encouragement). No private messaging minors. If you need help, contact a facilitator. Full rules are on our Community page.",
      },
      {
        q: "How do I contact a facilitator?",
        a: "You can reach our team through WhatsApp (link on every page), or speak directly to any facilitator at our in-person events. Facilitators wear name tags at café meetups.",
      },
      {
        q: "Can I become a volunteer or facilitator?",
        a: "Yes! We're always looking for passionate English speakers who want to help. Contact us through WhatsApp or apply through the community section. No teaching experience is required — we provide training.",
      },
    ],
  },
  {
    category: "Technical",
    questions: [
      {
        q: "Do I need to create an account?",
        a: "You can explore most of our content (tasters, resources, event info) without an account. An account is needed to access the student dashboard and track your cohort progress.",
      },
      {
        q: "What devices work with this website?",
        a: "Our website works on any modern device — phone, tablet, or computer. We recommend using a recent version of Chrome, Safari, Firefox, or Edge.",
      },
      {
        q: "I forgot my password. How do I reset it?",
        a: "Currently, please contact us on WhatsApp and we'll help reset your account. We're working on adding a self-service password reset feature.",
      },
    ],
  },
];

export default function FAQ() {
  return (
    <Layout>
      {/* Hero */}
      <div className="relative py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading font-black mb-4 tracking-tight text-foreground">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground font-medium max-w-2xl">
            Everything you need to know about our community, courses, and events.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10 md:py-16 max-w-4xl">
        {FAQ_SECTIONS.map((section) => (
          <div key={section.category} className="mb-10">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-4 pb-2 border-b">
              {section.category}
            </h2>
            <Accordion type="single" collapsible className="space-y-1">
              {section.questions.map((item, idx) => (
                <AccordionItem key={idx} value={`${section.category}-${idx}`} className="border rounded-xl px-4 mb-2">
                  <AccordionTrigger className="text-left font-bold text-sm sm:text-base hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-10 text-center border border-green-100">
          <MessageCircle className="w-10 h-10 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl sm:text-2xl font-heading font-bold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Our team is happy to help. Send us a message on WhatsApp and we'll get back to you quickly.
          </p>
          <Button className="rounded-full bg-green-600 hover:bg-green-700 text-white font-bold px-8 h-12 shadow-lg" asChild>
            <a href={whatsappLink("Hi! I have a question about English for Impact.")} target="_blank" rel="noreferrer">
              WhatsApp Us
            </a>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
