export type TasterTrackId = "a1-beginner" | "a2-elementary" | "intermediate" | "advanced";
export type ScaffoldLang = "en" | "ptBR" | "esLA";

export type LocalizedText = {
  en: string;
  ptBR?: string;
  esLA?: string;
};

export type TasterActivity =
  | {
      id: string;
      type: "mcq";
      title: string;
      prompt: string;
      options: string[];
      answerIndex: number;
      explanation: LocalizedText;
    }
  | {
      id: string;
      type: "fill";
      title: string;
      prompt: string;
      answer: string;
      explanation: LocalizedText;
      placeholder?: string;
    };

export type SpeakingPrompt = {
  title: string;
  prompt: LocalizedText;
  checklist: LocalizedText[];
};

export type TasterModule = {
  id: string;
  trackId: TasterTrackId;
  week: number;
  title: string;
  subtitle: LocalizedText;
  activities: TasterActivity[];
  speakingPrompt?: SpeakingPrompt;
};

export const tasterModules: TasterModule[] = [
  // ── A1 — Week 1 ──
  {
    id: "a1-w1",
    trackId: "a1-beginner",
    week: 1,
    title: "A1 Week 1 Taster: Introductions",
    subtitle: {
      en: 'Pronouns + verb "to be" + simple self-introduction.',
      ptBR: 'Pronomes + verbo "to be" + apresentação simples.',
      esLA: 'Pronombres + verbo "to be" + presentación simple.',
    },
    activities: [
      {
        id: "a1w1-mcq-1",
        type: "mcq",
        title: "Subject Pronouns",
        prompt: "Choose the correct pronoun: ___ am Brazilian.",
        options: ["He", "I", "They", "She"],
        answerIndex: 1,
        explanation: {
          en: '"I" goes with "am": I am Brazilian.',
          ptBR: 'Use "I" com "am": I am Brazilian (= Eu sou brasileiro/a).',
          esLA: 'Usa "I" con "am": I am Brazilian (= Yo soy brasileño/a).',
        },
      },
      {
        id: "a1w1-mcq-2",
        type: "mcq",
        title: 'Verb "to be"',
        prompt: "Choose the correct form: She ___ a teacher.",
        options: ["am", "is", "are", "be"],
        answerIndex: 1,
        explanation: {
          en: '"is" goes with he/she/it: She is a teacher.',
          ptBR: 'Use "is" com he/she/it: She is a teacher (= Ela é professora).',
          esLA: 'Usa "is" con he/she/it: She is a teacher (= Ella es profesora).',
        },
      },
      {
        id: "a1w1-fill-1",
        type: "fill",
        title: "Short Introduction",
        prompt: "Complete: Hello, my name ___ Ana.",
        answer: "is",
        explanation: {
          en: "We say: My name is Ana.",
          ptBR: "Dizemos: My name is Ana (= Meu nome é Ana).",
          esLA: "Decimos: My name is Ana (= Mi nombre es Ana).",
        },
        placeholder: "type your answer",
      },
      {
        id: "a1w1-mcq-3",
        type: "mcq",
        title: "Quick Q&A",
        prompt: "Choose the best question: ___ are you from?",
        options: ["What", "Where", "When", "Why"],
        answerIndex: 1,
        explanation: {
          en: '"Where are you from?" asks about origin/location.',
          ptBR: '"Where are you from?" pergunta de onde você é (origem).',
          esLA: '"Where are you from?" pregunta de dónde eres (origen).',
        },
      },
    ],
    speakingPrompt: {
      title: "Speaking (30 seconds)",
      prompt: {
        en: "Record a 30-second intro. Say: your name, where you're from, what you do, and one simple fact about you.",
        ptBR: "Grave uma apresentação de 30 segundos. Diga: seu nome, de onde você é, o que você faz e um fato simples sobre você.",
        esLA: "Graba una presentación de 30 segundos. Di: tu nombre, de dónde eres, qué haces y un dato simple sobre ti.",
      },
      checklist: [
        { en: "Name", ptBR: "Nome", esLA: "Nombre" },
        { en: "From (city/country)", ptBR: "De onde (cidade/país)", esLA: "De dónde (ciudad/país)" },
        { en: "Job/study", ptBR: "Trabalho/estudo", esLA: "Trabajo/estudio" },
        { en: "One fact (I like… / I have…)", ptBR: "Um fato (I like… / I have…)", esLA: "Un dato (I like… / I have…)" },
      ],
    },
  },

  // ── A2 — Week 1 ──
  {
    id: "a2-w1",
    trackId: "a2-elementary",
    week: 1,
    title: "A2 Week 1 Taster: Past Simple (Regular)",
    subtitle: {
      en: "Talk about last weekend using -ed verbs + simple story structure.",
      ptBR: "Fale sobre o último fim de semana usando verbos com -ed + estrutura simples de história.",
      esLA: "Habla del fin de semana pasado usando verbos con -ed + estructura simple de historia.",
    },
    activities: [
      {
        id: "a2w1-mcq-1",
        type: "mcq",
        title: "Past Simple (Regular)",
        prompt: "Choose the correct past tense: Yesterday I ___ a movie.",
        options: ["watch", "watched", "watching", "watches"],
        answerIndex: 1,
        explanation: {
          en: "Regular past tense adds -ed: watched.",
          ptBR: "O passado simples regular adiciona -ed: watched.",
          esLA: "El pasado simple regular agrega -ed: watched.",
        },
      },
      {
        id: "a2w1-fill-1",
        type: "fill",
        title: "Spelling: -ed",
        prompt: "Complete: I study → I ____ yesterday.",
        answer: "studied",
        explanation: {
          en: "When a verb ends in consonant + y, change y to i + ed: studied.",
          ptBR: "Quando o verbo termina em consoante + y, troque y por i + ed: studied.",
          esLA: "Cuando el verbo termina en consonante + y, cambia y por i + ed: studied.",
        },
        placeholder: "type the past tense",
      },
      {
        id: "a2w1-mcq-2",
        type: "mcq",
        title: "-ed Pronunciation (concept check)",
        prompt: "Which ending sound is common after /t/ or /d/?",
        options: ["/t/", "/d/", "/ɪd/", "/ʃ/"],
        answerIndex: 2,
        explanation: {
          en: "After /t/ or /d/, we usually pronounce -ed as /ɪd/ (e.g., wanted, needed).",
          ptBR: "Depois de /t/ ou /d/, geralmente pronunciamos -ed como /ɪd/ (ex.: wanted, needed).",
          esLA: "Después de /t/ o /d/, normalmente pronunciamos -ed como /ɪd/ (ej.: wanted, needed).",
        },
      },
      {
        id: "a2w1-mcq-3",
        type: "mcq",
        title: "Story Order",
        prompt: "Pick the best sequence for a short story:",
        options: [
          "Ending → Beginning → Middle",
          "Beginning → Middle → Ending",
          "Middle → Ending → Beginning",
          "Random details only",
        ],
        answerIndex: 1,
        explanation: {
          en: "A clear narrative is usually: beginning → middle → ending.",
          ptBR: "Uma narrativa clara normalmente é: começo → meio → fim.",
          esLA: "Una narrativa clara normalmente es: inicio → medio → final.",
        },
      },
    ],
    speakingPrompt: {
      title: "Speaking (60 seconds)",
      prompt: {
        en: "Tell a short weekend story: Where did you go? What did you do? How was it? Use 3 regular past verbs.",
        ptBR: "Conte uma história curta do fim de semana: Onde você foi? O que você fez? Como foi? Use 3 verbos regulares no passado.",
        esLA: "Cuenta una historia corta del fin de semana: ¿Adónde fuiste? ¿Qué hiciste? ¿Cómo fue? Usa 3 verbos regulares en pasado.",
      },
      checklist: [
        { en: "Place", ptBR: "Lugar", esLA: "Lugar" },
        { en: "Actions (3 verbs)", ptBR: "Ações (3 verbos)", esLA: "Acciones (3 verbos)" },
        { en: "Feeling/opinion", ptBR: "Sentimento/opinião", esLA: "Sentimiento/opinión" },
        { en: "Ending sentence", ptBR: "Frase final", esLA: "Frase final" },
      ],
    },
  },

  // ── Intermediate — Week 1 ──
  {
    id: "int-w1",
    trackId: "intermediate",
    week: 1,
    title: "Intermediate Week 1 Taster: Present Perfect vs Past Simple",
    subtitle: {
      en: "Experience vs specific time — choose the right tense.",
      ptBR: "Experiência vs tempo específico — escolha o tempo verbal certo.",
      esLA: "Experiencia vs tiempo específico — elige el tiempo verbal correcto.",
    },
    activities: [
      {
        id: "intw1-mcq-1",
        type: "mcq",
        title: "Experience (no specific time)",
        prompt: "Choose the best option: I ___ to Argentina.",
        options: ["went", "have been", "was going", "go"],
        answerIndex: 1,
        explanation: {
          en: "Use present perfect for life experience without a specific time: have been.",
          ptBR: "Use present perfect para experiência de vida sem tempo específico: have been.",
          esLA: "Usa present perfect para experiencia de vida sin tiempo específico: have been.",
        },
      },
      {
        id: "intw1-mcq-2",
        type: "mcq",
        title: "Specific time",
        prompt: "Choose the best option: I ___ to Argentina in 2019.",
        options: ["have been", "go", "went", "have go"],
        answerIndex: 2,
        explanation: {
          en: "Use past simple with a finished time: in 2019 → went.",
          ptBR: "Use past simple com tempo finalizado: in 2019 → went.",
          esLA: "Usa past simple con tiempo terminado: in 2019 → went.",
        },
      },
      {
        id: "intw1-fill-1",
        type: "fill",
        title: "Time Marker Rule",
        prompt: 'Fill in: Use past simple with a finished time like "____ 2020".',
        answer: "in",
        explanation: {
          en: 'A common finished-time marker is "in + year": in 2020.',
          ptBR: 'Um marcador comum de tempo finalizado é "in + ano": in 2020.',
          esLA: 'Un marcador común de tiempo terminado es "in + año": in 2020.',
        },
        placeholder: "type one word",
      },
    ],
    speakingPrompt: {
      title: "Speaking (2 minutes)",
      prompt: {
        en: "Say 2 experiences you've had (present perfect), then describe 1 specific event (past simple) with when + where + what happened.",
        ptBR: "Diga 2 experiências que você já teve (present perfect) e depois descreva 1 evento específico (past simple) com quando + onde + o que aconteceu.",
        esLA: "Di 2 experiencias que has tenido (present perfect) y luego describe 1 evento específico (past simple) con cuándo + dónde + qué pasó.",
      },
      checklist: [
        { en: "2 experiences (have + past participle)", ptBR: "2 experiências (have + particípio)", esLA: "2 experiencias (have + participio)" },
        { en: "1 event (past simple)", ptBR: "1 evento (past simple)", esLA: "1 evento (past simple)" },
        { en: "Clear time marker", ptBR: "Marcador de tempo claro", esLA: "Marcador de tiempo claro" },
      ],
    },
  },

  // ── Advanced — Week 1 ──
  {
    id: "adv-w1",
    trackId: "advanced",
    week: 1,
    title: "Advanced Week 1 Taster: Nominalization + Complex Structures",
    subtitle: {
      en: "Upgrade style for academic/persuasive writing.",
      ptBR: "Eleve o estilo para escrita acadêmica/persuasiva.",
      esLA: "Mejora el estilo para escritura académica/persuasiva.",
    },
    activities: [
      {
        id: "advw1-mcq-1",
        type: "mcq",
        title: "Nominalization",
        prompt: '"We decided to expand." → "The ____ to expand…"',
        options: ["decide", "decision", "deciding", "decisive"],
        answerIndex: 1,
        explanation: {
          en: "Nominalization turns verbs into nouns: decide → decision.",
          ptBR: "Nominalização transforma verbos em substantivos: decide → decision.",
          esLA: "La nominalización transforma verbos en sustantivos: decide → decision.",
        },
      },
      {
        id: "advw1-mcq-2",
        type: "mcq",
        title: "More Academic Tone",
        prompt: "Pick the more academic option:",
        options: [
          "A lot of people think it's bad.",
          "It is widely perceived as detrimental.",
          "It's kinda bad for everyone.",
          "People say it's not good.",
        ],
        answerIndex: 1,
        explanation: {
          en: "Academic tone uses precise vocabulary and avoids informal phrasing.",
          ptBR: "Tom acadêmico usa vocabulário preciso e evita linguagem informal.",
          esLA: "El tono académico usa vocabulario preciso y evita lenguaje informal.",
        },
      },
      {
        id: "advw1-fill-1",
        type: "fill",
        title: "Complex Clause",
        prompt: 'Complete: "Although it was costly, it ____ effective."',
        answer: "was",
        explanation: {
          en: "Keep tense consistent: Although it was…, it was…",
          ptBR: "Mantenha o tempo consistente: Although it was…, it was…",
          esLA: "Mantén el tiempo consistente: Although it was…, it was…",
        },
        placeholder: "type one word",
      },
    ],
    speakingPrompt: {
      title: "Speaking (2 minutes)",
      prompt: {
        en: "Argue one point (for or against) using formal tone. Include 1 nominalization and 1 complex clause (Although…, While…).",
        ptBR: "Defenda um ponto (a favor ou contra) usando tom formal. Inclua 1 nominalização e 1 oração complexa (Although…, While…).",
        esLA: "Defiende un punto (a favor o en contra) usando tono formal. Incluye 1 nominalización y 1 oración compleja (Although…, While…).",
      },
      checklist: [
        { en: "Claim", ptBR: "Tese/afirmação", esLA: "Tesis/afirmación" },
        { en: "Reason + example", ptBR: "Razão + exemplo", esLA: "Razón + ejemplo" },
        { en: "Nominalization used", ptBR: "Nominalização usada", esLA: "Nominalización usada" },
        { en: "Complex clause used", ptBR: "Oração complexa usada", esLA: "Oración compleja usada" },
      ],
    },
  },
];

export function getTasterModule(trackId: string | undefined, week: number) {
  return tasterModules.find((m) => m.trackId === trackId && m.week === week);
}
