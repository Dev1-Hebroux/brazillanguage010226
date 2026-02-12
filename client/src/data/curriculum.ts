// client/src/data/curriculum.ts

export type TrackId =
  | "a1-beginner"
  | "a2-elementary"
  | "intermediate"
  | "advanced";

export type WeekSkills = {
  listening?: string;
  speaking?: string;
  reading?: string;
  writing?: string;
};

export type SessionFlowStep = {
  step: number;
  minutes: number;
  title: string;
  description: string;
};

export type WeekResource = {
  id: string;
  title: string;
  type: "pdf" | "doc" | "audio" | "slides" | "link";
  href: string;
};

export type CurriculumWeek = {
  week: number;
  title: string;
  summary: string;

  communicativeGoal?: string;

  languageFocus: string[];
  skills?: WeekSkills;

  task: string;
  assessment?: string[];

  contrastiveFocus?: string;
  latinAmericanFocus?: string;

  dailyPrompts: string[];
  sessionFlow: SessionFlowStep[];
  resources: WeekResource[];
};

export type Track = {
  id: TrackId;
  title: string;
  cefrLevel: "A1" | "A2" | "B1/B2" | "C1/C2";
  level: "Beginner" | "Elementary" | "Intermediate" | "Advanced";
  duration: string;

  whoItsFor: string;

  communicativeFocus: string;
  youWillLearn: string[];
  outcomes: string[];

  finalAssessment: string;
  ieltsAlignment?: string[];

  schedule: string;
  color: string;
  accent: string;
  buttonColor: string;

  weeks: CurriculumWeek[];
};

const defaultSessionFlow = (task: string): SessionFlowStep[] => [
  { step: 1, minutes: 5, title: "Warm-up", description: "Quick check-in + activation questions." },
  { step: 2, minutes: 10, title: "Language Focus", description: "Teacher-led input + micro-drills." },
  { step: 3, minutes: 15, title: "Guided Practice", description: "Pairs/groups practice with scaffolding." },
  { step: 4, minutes: 20, title: "Conversation Circle", description: `Main communicative task: ${task}` },
  { step: 5, minutes: 10, title: "Feedback + Next Steps", description: "Corrections, reflection, homework prompts." },
];

const defaultResources = (week: number, trackLabel: string): WeekResource[] => [
  { id: `${trackLabel}-w${week}-slides`, title: `Week ${week} Slides`, type: "slides", href: "#" },
  { id: `${trackLabel}-w${week}-worksheet`, title: `Week ${week} Worksheet`, type: "pdf", href: "#" },
  { id: `${trackLabel}-w${week}-audio`, title: `Week ${week} Audio Practice`, type: "audio", href: "#" },
  { id: `${trackLabel}-w${week}-homework`, title: `Week ${week} Homework`, type: "doc", href: "#" },
];

export const tracks: Track[] = [
  {
    id: "a1-beginner",
    title: "A1 Cohort",
    cefrLevel: "A1",
    level: "Beginner",
    duration: "8 weeks",
    schedule: "8 weeks",
    color: "bg-blue-50",
    accent: "text-blue-700",
    buttonColor: "bg-blue-600 hover:bg-blue-700",

    whoItsFor: "Complete beginners or learners rebuilding fundamentals from zero.",
    communicativeFocus:
      "Communicative focus: Introductions, personal info, family, daily routine, places, requests, and real-life simulations.",
    youWillLearn: [
      "Alphabet & pronunciation",
      "Verb to be + subject pronouns",
      "Articles, possessives, plural nouns",
      "Simple present (affirmative/negative/questions) + question words",
      "Prepositions (in/on/at) + there is/are",
      "Modal can for abilities and requests",
    ],
    outcomes: [
      "Introduce yourself and exchange basic personal information.",
      "Describe family, routines, home and city using simple structures.",
      "Ask and answer everyday questions in short role-plays.",
    ],
    finalAssessment: "Oral role-play + short written description (80–100 words).",

    weeks: [
      {
        week: 1,
        title: "Introductions + Personal Info",
        summary:
          "Introduce yourself + personal info; listening/speaking/reading/writing basics; 30-second oral intro + short self-profile.",
        communicativeGoal: "Introduce oneself and exchange personal information.",
        languageFocus: ["Alphabet & pronunciation", "Verb to be", "Subject pronouns"],
        skills: {
          listening: "Basic introductions",
          speaking: "Name, nationality, job",
          reading: "Short personal profiles",
          writing: "Simple sentences",
        },
        task: "Introduce yourself to the group (30 seconds) and write a short self-profile.",
        assessment: ["Oral introduction (30 seconds)", "Short written self-profile (5–6 sentences)"],
        dailyPrompts: [
          "Mon: Record a 20–30 sec intro: name, country, job/study, one fact.",
          "Tue: Write 5–6 sentences using 'to be' + subject pronouns.",
          "Wed: Listen to a short intro and answer 3 comprehension questions.",
          "Thu: Pair practice: ask/answer 5 personal info questions.",
        ],
        sessionFlow: defaultSessionFlow("Mini networking circle: introduce + ask 2 follow-up questions."),
        resources: defaultResources(1, "a1"),
      },
      {
        week: 2,
        title: "Family + Possessions",
        summary: "Articles, possessives, plurals; describe family and possessions; family description (oral + written).",
        languageFocus: ["Articles (a/an/the)", "Possessive adjectives", "Plural nouns"],
        contrastiveFocus: "Gendered nouns (Romance languages × English).",
        task: "Describe your family and possessions using articles, possessives, and plurals.",
        assessment: ["Family description (oral + written)"],
        dailyPrompts: [
          "Mon: Write 6 sentences describing 3 family members (my/his/her + a/an/the).",
          "Tue: Turn 8 singular nouns into plural + say them aloud.",
          "Wed: Show-and-tell: describe 3 items you own using 'a/an/the' + 'my'.",
          "Thu: Role-play: meet someone and talk about family for 2 minutes.",
        ],
        sessionFlow: defaultSessionFlow("Family & possessions show-and-tell (pairs → group share)."),
        resources: defaultResources(2, "a1"),
      },
      {
        week: 3,
        title: "Daily Routine",
        summary: "Simple present (affirmative), adverbs of frequency; describe daily routine.",
        languageFocus: ["Simple present (affirmative)", "Adverbs of frequency"],
        task: "Describe your daily routine using the simple present and frequency adverbs.",
        dailyPrompts: [
          "Mon: Write your routine with 6 simple present sentences.",
          "Tue: Add 4 frequency adverbs (always/usually/sometimes/never) to your routine.",
          "Wed: Ask a partner 5 routine questions; write their answers.",
          "Thu: Record 45 seconds describing a typical weekday.",
        ],
        sessionFlow: defaultSessionFlow("Routine interview: ask/answer → report to class."),
        resources: defaultResources(3, "a1"),
      },
      {
        week: 4,
        title: "Questions + Interviews",
        summary: "Simple present (negative/questions), question words; interview a classmate; Q&A role play.",
        languageFocus: ["Simple present (negative & questions)", "Question words"],
        task: "Interview a classmate and perform a Q&A role-play.",
        assessment: ["Question–answer role play"],
        dailyPrompts: [
          "Mon: Build 10 questions using what/where/when/who/why/how.",
          "Tue: Convert 6 affirmative sentences into negatives.",
          "Wed: Practice 6 yes/no questions and short answers.",
          "Thu: 2-minute interview recording: ask at least 6 questions.",
        ],
        sessionFlow: defaultSessionFlow("Interview circle: rotate partners every 3 minutes."),
        resources: defaultResources(4, "a1"),
      },
      {
        week: 5,
        title: "Home + City",
        summary: "Prepositions (in/on/at), there is/there are; describe home and city.",
        languageFocus: ["Prepositions (in/on/at)", "There is / There are"],
        task: "Describe your home and city using there is/are and in/on/at.",
        dailyPrompts: [
          "Mon: Write 6 'there is/are' sentences about your home.",
          "Tue: Write 6 'there is/are' sentences about your city.",
          "Wed: Practice 10 in/on/at examples (home + city locations).",
          "Thu: Give directions to 2 places using in/on/at + landmarks.",
        ],
        sessionFlow: defaultSessionFlow("City tour role-play: describe + give simple directions."),
        resources: defaultResources(5, "a1"),
      },
      {
        week: 6,
        title: "Requests + Abilities",
        summary: "Modal can; requests and abilities; asking for help/services.",
        languageFocus: ["Modal can", "Requests and abilities"],
        task: "Role-play asking for help and requesting services using 'can'.",
        dailyPrompts: [
          "Mon: Write 8 sentences with 'I can / I can't' (skills/abilities).",
          "Tue: Create 6 polite requests using 'Can you…?'",
          "Wed: Service role-play script: shop/café/hotel requests.",
          "Thu: Record 60 seconds: ask for help + respond politely.",
        ],
        sessionFlow: defaultSessionFlow("Service desk simulation: requests + solutions."),
        resources: defaultResources(6, "a1"),
      },
      {
        week: 7,
        title: "Real-life Simulation",
        summary: "Review and integration; real-life simulation (shopping, directions).",
        languageFocus: ["Review and integration"],
        task: "Complete real-life simulations: shopping + directions.",
        dailyPrompts: [
          "Mon: Review week 1–3 key patterns (to be + simple present).",
          "Tue: Review week 4 questions (WH + yes/no).",
          "Wed: Review week 5–6 (there is/are + in/on/at + can).",
          "Thu: Prepare for simulations: write 10 useful phrases.",
        ],
        sessionFlow: defaultSessionFlow("Shopping + directions simulation (stations)."),
        resources: defaultResources(7, "a1"),
      },
      {
        week: 8,
        title: "Final Assessment",
        summary: "Final assessments: oral role-play + short written description (80–100 words).",
        languageFocus: ["Integrated review"],
        task: "Complete the final oral role-play and submit the final writing.",
        assessment: ["Oral role-play", "Short written description (80–100 words)"],
        dailyPrompts: [
          "Mon: Plan your role-play: script 8–10 lines.",
          "Tue: Practice aloud 3 times and improve pronunciation.",
          "Wed: Draft your 80–100 word description; revise for clarity.",
          "Thu: Submit oral + writing and self-reflect (3 wins + 1 goal).",
        ],
        sessionFlow: defaultSessionFlow("Assessment delivery + feedback."),
        resources: defaultResources(8, "a1"),
      },
    ],
  },

  {
    id: "a2-elementary",
    title: "A2 Cohort",
    cefrLevel: "A2",
    level: "Elementary",
    duration: "8 weeks",
    schedule: "8 weeks",
    color: "bg-emerald-50",
    accent: "text-emerald-700",
    buttonColor: "bg-emerald-600 hover:bg-emerald-700",

    whoItsFor: "Learners who can handle basics and want to speak about the past and future with confidence.",
    communicativeFocus:
      "Communicative focus: Talking about the past, describing experiences, plans, advice, comparisons, travel role-plays.",
    youWillLearn: [
      "Past simple (regular + irregular)",
      "Present continuous vs simple present",
      "Future: going to",
      "Modals: must / should",
      "Comparatives & superlatives",
    ],
    outcomes: [
      "Talk about past activities and personal experiences using past simple.",
      "Discuss plans and intentions using going to.",
      "Compare places and give advice using must/should.",
    ],
    finalAssessment: "Oral narrative + short email (100–120 words).",

    weeks: [
      {
        week: 1,
        title: "Past Simple (Regular)",
        summary: "Past simple (regular verbs); talk about last weekend.",
        languageFocus: ["Past simple (regular verbs)"],
        task: "Talk about last weekend using regular past simple verbs.",
        dailyPrompts: [
          "Mon: Write 8 sentences about last weekend (regular verbs).",
          "Tue: Practice -ed pronunciation (/t/, /d/, /ɪd/) with 10 verbs.",
          "Wed: Ask/answer 6 weekend questions in pairs.",
          "Thu: Record 60 seconds: last weekend story (beginning–middle–end).",
        ],
        sessionFlow: defaultSessionFlow("Weekend story circle: tell → ask 2 follow-up questions."),
        resources: defaultResources(1, "a2"),
      },
      {
        week: 2,
        title: "Past Simple (Irregular)",
        summary: "Past simple (irregular verbs); short personal narrative.",
        languageFocus: ["Past simple (irregular verbs)"],
        task: "Tell a short personal narrative using common irregular verbs.",
        dailyPrompts: [
          "Mon: Memorize 10 irregular verbs (go/went, have/had, etc.).",
          "Tue: Write a 120-word short story using at least 6 irregular verbs.",
          "Wed: Swap stories and underline irregular verbs.",
          "Thu: Oral narrative practice: 90 seconds + feedback.",
        ],
        sessionFlow: defaultSessionFlow("Storytelling ladder: 30s → 60s → 90s versions."),
        resources: defaultResources(2, "a2"),
      },
      {
        week: 3,
        title: "Present Continuous vs Simple Present",
        summary: "Present continuous; contrast with simple present.",
        languageFocus: ["Present continuous", "Contrast with simple present"],
        latinAmericanFocus: "Aspectual confusion (no progressive in Spanish).",
        task: "Explain what you do (habit) vs what you're doing now (in progress).",
        dailyPrompts: [
          "Mon: Write 6 habit sentences (simple present) + 6 'now' sentences (present continuous).",
          "Tue: Correct 10 mixed tense sentences (habit vs now).",
          "Wed: Describe 5 pictures: what's happening right now.",
          "Thu: Role-play: phone call—explain what you're doing + your usual routine.",
        ],
        sessionFlow: defaultSessionFlow("Spot the difference: habits vs now role-plays."),
        resources: defaultResources(3, "a2"),
      },
      {
        week: 4,
        title: "Future: Going To",
        summary: "Future: going to; plans and intentions.",
        languageFocus: ["Future: going to"],
        task: "Talk about your plans and intentions using 'going to'.",
        dailyPrompts: [
          "Mon: Write 8 sentences: plans for this week using 'going to'.",
          "Tue: Ask 6 questions about future plans; record answers.",
          "Wed: Create a mini plan: weekend schedule (3–5 items).",
          "Thu: Present your plan in 60 seconds + 2 questions from peers.",
        ],
        sessionFlow: defaultSessionFlow("Planning circle: share plans + negotiate one group plan."),
        resources: defaultResources(4, "a2"),
      },
      {
        week: 5,
        title: "Advice + Obligation",
        summary: "Modals: must / should; giving advice.",
        languageFocus: ["Modals: must / should"],
        task: "Give advice and express obligation using must/should.",
        dailyPrompts: [
          "Mon: Write 6 must sentences (rules/obligation).",
          "Tue: Write 6 should sentences (advice).",
          "Wed: Advice clinic: solve 3 problems with should/must.",
          "Thu: Record: 1-minute advice to a friend.",
        ],
        sessionFlow: defaultSessionFlow("Advice clinic role-play: problem cards → solutions."),
        resources: defaultResources(5, "a2"),
      },
      {
        week: 6,
        title: "Comparatives + Superlatives",
        summary: "Comparatives & superlatives; compare cities/countries in Latin America.",
        languageFocus: ["Comparatives & superlatives"],
        task: "Compare cities/countries using comparatives and superlatives.",
        dailyPrompts: [
          "Mon: Write 8 comparatives (bigger, more interesting, etc.).",
          "Tue: Write 6 superlatives (the biggest, the most beautiful, etc.).",
          "Wed: Compare 2 places you know (8 sentences).",
          "Thu: Mini-presentation: the best place to visit (60–90 seconds).",
        ],
        sessionFlow: defaultSessionFlow("Debate: best city/country—defend with superlatives."),
        resources: defaultResources(6, "a2"),
      },
      {
        week: 7,
        title: "Travel Role-plays",
        summary: "Functional review; travel role-plays.",
        languageFocus: ["Functional review"],
        task: "Perform travel role-plays (airport/hotel/restaurant/directions).",
        dailyPrompts: [
          "Mon: Review past + future + requests (key phrases list).",
          "Tue: Create a travel dialogue (10 lines).",
          "Wed: Practice role-plays with rotating partners.",
          "Thu: Record: 90-second travel simulation.",
        ],
        sessionFlow: defaultSessionFlow("Travel stations: rotate scenarios every 5 minutes."),
        resources: defaultResources(7, "a2"),
      },
      {
        week: 8,
        title: "Final Assessment",
        summary: "Final assessments: oral narrative + short email (100–120 words).",
        languageFocus: ["Integrated review"],
        task: "Deliver oral narrative and submit the final email writing.",
        assessment: ["Oral narrative", "Short email (100–120 words)"],
        dailyPrompts: [
          "Mon: Outline your narrative (beginning–middle–end).",
          "Tue: Practice and improve your narrative timing (2–3 min).",
          "Wed: Draft your 100–120 word email; revise tone + clarity.",
          "Thu: Submit oral + email; self-review with a checklist.",
        ],
        sessionFlow: defaultSessionFlow("Assessment delivery + feedback."),
        resources: defaultResources(8, "a2"),
      },
    ],
  },

  {
    id: "intermediate",
    title: "Intermediate Cohort",
    cefrLevel: "B1/B2",
    level: "Intermediate",
    duration: "8 weeks",
    schedule: "8 weeks",
    color: "bg-violet-50",
    accent: "text-violet-700",
    buttonColor: "bg-violet-600 hover:bg-violet-700",

    whoItsFor: "Learners who can communicate but want stronger accuracy, structure, and discussion skills.",
    communicativeFocus:
      "Communicative focus: Experiences, problem-solving discussions, clearer structure in speaking/writing, more formal grammar.",
    youWillLearn: [
      "Present perfect vs past simple",
      "Future forms (will / going to) + first conditional",
      "Passive voice + formal tone",
      "Reported speech (basic)",
      "Linking words + paragraph structure",
    ],
    outcomes: [
      "Describe experiences and events with more detail and accuracy.",
      "Participate in structured problem-solving discussions.",
      "Write a clear opinion paragraph/essay with linking words.",
    ],
    finalAssessment: "Oral presentation (3–4 minutes) + opinion essay (180–200 words).",
    ieltsAlignment: ["Task 1 narrative", "Task 2 opinion paragraph"],

    weeks: [
      {
        week: 1,
        title: "Present Perfect vs Past Simple",
        summary: "Present perfect vs past simple; describe experiences and events with some detail.",
        languageFocus: ["Present perfect vs past simple"],
        task: "Talk about life experiences and specific past events with the correct tense choice.",
        dailyPrompts: [
          "Mon: Write 6 present perfect sentences (life experiences).",
          "Tue: Write 6 past simple sentences (specific events + time).",
          "Wed: Correct tense choice in 10 mixed sentences.",
          "Thu: Record: 2-minute story mixing experiences + a specific event.",
        ],
        sessionFlow: defaultSessionFlow("Experience vs event interview: ask → clarify → summarize."),
        resources: defaultResources(1, "int"),
      },
      {
        week: 2,
        title: "Life Experiences Interview",
        summary: "Task week: life experiences interview.",
        languageFocus: ["Functional review: present perfect vs past simple"],
        task: "Conduct a life experiences interview and report key findings.",
        dailyPrompts: [
          "Mon: Prepare 10 interview questions (Have you ever…? / When did you…?).",
          "Tue: Interview a partner; capture notes.",
          "Wed: Write a short report (120–150 words).",
          "Thu: Present your partner's experiences (90 seconds).",
        ],
        sessionFlow: defaultSessionFlow("Interview + reporting circle (accuracy focus)."),
        resources: defaultResources(2, "int"),
      },
      {
        week: 3,
        title: "Future Forms + First Conditional",
        summary: "Future forms (will/going to) + first conditional.",
        languageFocus: ["Future forms (will / going to)", "First conditional"],
        task: "Discuss predictions, plans, and consequences using future forms and the first conditional.",
        dailyPrompts: [
          "Mon: Write 6 will predictions + 6 going to plans.",
          "Tue: Write 8 first conditional sentences (If…, I will…).",
          "Wed: Debate: 'If we do X, what will happen?'",
          "Thu: Record: 2 minutes—plans + conditional consequences.",
        ],
        sessionFlow: defaultSessionFlow("Scenario planning: choose options → predict outcomes."),
        resources: defaultResources(3, "int"),
      },
      {
        week: 4,
        title: "Problem-solving Discussions",
        summary: "Task week: problem-solving discussions.",
        languageFocus: ["Discussion language", "Negotiation phrases"],
        task: "Participate in a structured problem-solving discussion and reach a decision.",
        dailyPrompts: [
          "Mon: Learn 10 discussion phrases (I agree/disagree, in my view…).",
          "Tue: Analyze a scenario and propose 2 solutions.",
          "Wed: Group discussion: evaluate options + decide.",
          "Thu: Write a decision summary (120–150 words).",
        ],
        sessionFlow: defaultSessionFlow("Problem-solving meeting simulation (roles + decision)."),
        resources: defaultResources(4, "int"),
      },
      {
        week: 5,
        title: "Passive Voice + Formal Tone",
        summary: "Passive voice; formal tone.",
        languageFocus: ["Passive voice", "Formal tone"],
        task: "Rewrite informal statements into formal/passive structures where appropriate.",
        dailyPrompts: [
          "Mon: Transform 10 active sentences to passive.",
          "Tue: Rewrite 6 informal sentences into formal tone.",
          "Wed: Describe a process (how something is made) in passive voice.",
          "Thu: Record: 90 seconds explaining a process.",
        ],
        sessionFlow: defaultSessionFlow("Process explanation clinic (formality + clarity)."),
        resources: defaultResources(5, "int"),
      },
      {
        week: 6,
        title: "Reported Speech (Basic)",
        summary: "Reported speech (basic).",
        languageFocus: ["Reported speech (basic)"],
        task: "Report what someone said using basic reported speech structures.",
        dailyPrompts: [
          "Mon: Convert 8 direct quotes to reported speech.",
          "Tue: Practice reporting advice and statements.",
          "Wed: Pair activity: mini interview → report answers.",
          "Thu: Record: 90 seconds reporting a conversation.",
        ],
        sessionFlow: defaultSessionFlow("News reporter simulation: report a short interview."),
        resources: defaultResources(6, "int"),
      },
      {
        week: 7,
        title: "Linking Words + Paragraph Structure",
        summary: "Linking words; paragraph structure.",
        languageFocus: ["Linking words", "Paragraph structure"],
        task: "Write a structured paragraph using linking words and clear organization.",
        dailyPrompts: [
          "Mon: Learn 12 linking words (however, therefore, moreover…).",
          "Tue: Outline a paragraph (topic sentence + support + conclusion).",
          "Wed: Draft a 150–180 word opinion paragraph.",
          "Thu: Edit for cohesion (linkers + clarity).",
        ],
        sessionFlow: defaultSessionFlow("Writing workshop: draft → peer review → revise."),
        resources: defaultResources(7, "int"),
      },
      {
        week: 8,
        title: "Final Assessment",
        summary: "Final assessments: oral presentation (3–4 minutes) + opinion essay (180–200 words).",
        languageFocus: ["Integrated review"],
        task: "Deliver oral presentation and submit opinion essay.",
        assessment: ["Oral presentation (3–4 minutes)", "Opinion essay (180–200 words)"],
        dailyPrompts: [
          "Mon: Choose your topic and outline the presentation.",
          "Tue: Practice your presentation and improve transitions.",
          "Wed: Draft the essay (180–200 words) with linking words.",
          "Thu: Submit presentation + essay; self-evaluate with a rubric.",
        ],
        sessionFlow: defaultSessionFlow("Assessment delivery + feedback."),
        resources: defaultResources(8, "int"),
      },
    ],
  },

  {
    id: "advanced",
    title: "Advanced Cohort",
    cefrLevel: "C1/C2",
    level: "Advanced",
    duration: "8 weeks",
    schedule: "8 weeks",
    color: "bg-amber-50",
    accent: "text-amber-800",
    buttonColor: "bg-amber-600 hover:bg-amber-700",

    whoItsFor: "Advanced speakers who want precision, academic/persuasive output, and tone control.",
    communicativeFocus:
      "Communicative focus: Fluent, precise expression; academic and persuasive output; pragmatic tone control.",
    youWillLearn: [
      "Complex clause structures + nominalization",
      "Inversion & emphasis",
      "Idiomatic language + register",
      "Pragmatics & tone",
      "Academic discussion + persuasive speaking",
    ],
    outcomes: [
      "Express complex ideas fluently and precisely in speech and writing.",
      "Use emphasis, register, and idiomatic language appropriately.",
      "Produce academic/persuasive work and defend ideas confidently.",
    ],
    finalAssessment: "Academic essay (280–300 words) + extended oral defense.",

    weeks: [
      {
        week: 1,
        title: "Complex Structures + Nominalization",
        summary: "Complex clause structures; nominalization; express ideas fluently and precisely.",
        languageFocus: ["Complex clause structures", "Nominalization"],
        task: "Rewrite ideas using more advanced clause structures and nominalization.",
        dailyPrompts: [
          "Mon: Transform 8 simple sentences into complex sentences.",
          "Tue: Practice nominalization (e.g., decide → decision) in 10 examples.",
          "Wed: Write a short paragraph using 6 nominalizations.",
          "Thu: Record: 2-minute explanation using complex clauses.",
        ],
        sessionFlow: defaultSessionFlow("Precision clinic: upgrade sentences for formality + clarity."),
        resources: defaultResources(1, "adv"),
      },
      {
        week: 2,
        title: "Academic Discussion",
        summary: "Task week: academic discussion.",
        languageFocus: ["Academic discussion language", "Argument support"],
        task: "Participate in an academic discussion using evidence and careful hedging.",
        dailyPrompts: [
          "Mon: Learn 10 academic phrases (It appears that…, The evidence suggests…).",
          "Tue: Prepare a stance + 2 supporting arguments.",
          "Wed: Discussion practice: respond + counter politely.",
          "Thu: Reflection writing: strongest point + weakness (150–180 words).",
        ],
        sessionFlow: defaultSessionFlow("Seminar circle: claims → evidence → rebuttal."),
        resources: defaultResources(2, "adv"),
      },
      {
        week: 3,
        title: "Inversion + Emphasis",
        summary: "Inversion & emphasis.",
        languageFocus: ["Inversion & emphasis"],
        task: "Use inversion and emphasis to improve rhetorical impact.",
        dailyPrompts: [
          "Mon: Create 8 inversion sentences (Not only…, Rarely…, etc.).",
          "Tue: Rewrite a paragraph adding emphasis structures.",
          "Wed: Practice delivering emphasized lines with intonation.",
          "Thu: Record: 90 seconds persuasive message using 3 inversions.",
        ],
        sessionFlow: defaultSessionFlow("Rhetoric practice: rewrite → perform → feedback."),
        resources: defaultResources(3, "adv"),
      },
      {
        week: 4,
        title: "Persuasive Speech",
        summary: "Task week: persuasive speech.",
        languageFocus: ["Persuasion strategies", "Audience framing"],
        task: "Deliver a persuasive speech with strong structure and register control.",
        dailyPrompts: [
          "Mon: Pick a topic + define audience + purpose.",
          "Tue: Draft an outline (hook, 3 points, call-to-action).",
          "Wed: Practice with timing (3–4 minutes).",
          "Thu: Deliver your speech and get peer feedback.",
        ],
        sessionFlow: defaultSessionFlow("Persuasive speaking showcase + peer review."),
        resources: defaultResources(4, "adv"),
      },
      {
        week: 5,
        title: "Idioms + Register",
        summary: "Idiomatic language; register.",
        languageFocus: ["Idiomatic language", "Register"],
        task: "Use idioms appropriately and switch register for different contexts.",
        dailyPrompts: [
          "Mon: Learn 12 idioms and write 8 example sentences.",
          "Tue: Rewrite informal text into formal register and back.",
          "Wed: Identify register mistakes in 10 sentences.",
          "Thu: Role-play: informal chat vs formal meeting (same topic).",
        ],
        sessionFlow: defaultSessionFlow("Register switch drill: same message, different audiences."),
        resources: defaultResources(5, "adv"),
      },
      {
        week: 6,
        title: "Pragmatics + Tone",
        summary: "Pragmatics & tone.",
        languageFocus: ["Pragmatics & tone"],
        task: "Adjust tone (direct/indirect, polite/firm) in requests and disagreements.",
        dailyPrompts: [
          "Mon: Rewrite 8 direct sentences into polite but firm alternatives.",
          "Tue: Practice softeners and hedging (might, could, perhaps…).",
          "Wed: Role-play disagreement with diplomacy.",
          "Thu: Record: 2-minute negotiation with tone control.",
        ],
        sessionFlow: defaultSessionFlow("Tone lab: calibrate politeness and firmness."),
        resources: defaultResources(6, "adv"),
      },
      {
        week: 7,
        title: "Speaking Simulation",
        summary: "Task week: speaking simulation.",
        languageFocus: ["Simulation language", "Real-time fluency strategies"],
        task: "Complete a speaking simulation under time pressure with feedback.",
        dailyPrompts: [
          "Mon: Prepare a response framework (claim–support–example).",
          "Tue: Timed speaking: 60 seconds, then 90 seconds.",
          "Wed: Handle follow-up questions (improv practice).",
          "Thu: Full simulation recording + reflection.",
        ],
        sessionFlow: defaultSessionFlow("Timed simulation + Q&A defense."),
        resources: defaultResources(7, "adv"),
      },
      {
        week: 8,
        title: "Final Assessment",
        summary: "Final assessments: academic essay (280–300 words) + extended oral defense.",
        languageFocus: ["Integrated review"],
        task: "Submit academic essay and complete oral defense.",
        assessment: ["Academic essay (280–300 words)", "Extended oral defense"],
        dailyPrompts: [
          "Mon: Select essay question + outline argument.",
          "Tue: Draft essay (280–300 words) with academic style.",
          "Wed: Revise for cohesion, register, and precision.",
          "Thu: Oral defense practice: 3 questions + strong answers.",
        ],
        sessionFlow: defaultSessionFlow("Assessment delivery + feedback."),
        resources: defaultResources(8, "adv"),
      },
    ],
  },
];

export function getTrackById(id?: string | null): Track | undefined {
  return tracks.find((t) => t.id === id);
}
