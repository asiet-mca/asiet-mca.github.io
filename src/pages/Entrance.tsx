import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  BookBookmark,
  BookOpenText,
  Books,
  Brain,
  CalendarCheck,
  CaretDown,
  ChartBar,
  Clock,
  EnvelopeSimple,
  Exam,
  FolderSimple,
  GraduationCap,
  House,
  Lightning,
  ListChecks,
  MapPin,
  MathOperations,
  Phone,
  Question,
  Scales,
  Target,
  Timer,
  Translate,
  Trophy,
  DownloadSimple,
  FilePdf,
  FileDoc,
  Database,
  Newspaper,
} from "@phosphor-icons/react";

/* ─── Data ─── */

const examSections = [
  { subject: "Computer Science", questions: 50, marks: 50, color: "#047857", icon: Brain },
  { subject: "Mathematics & Statistics", questions: 25, marks: 25, color: "#0369A1", icon: MathOperations },
  { subject: "Quantitative Aptitude & Logical Ability", questions: 25, marks: 25, color: "#7C3AED", icon: ChartBar },
  { subject: "English", questions: 15, marks: 15, color: "#B45309", icon: Translate },
  { subject: "General Knowledge", questions: 5, marks: 5, color: "#6D28D9", icon: Newspaper },
];

const syllabus = [
  {
    subject: "Computer Science",
    icon: Brain,
    color: "#047857",
    topics: [
      { name: "Computer Basics", details: "Organization of a computer, CPU structure, Input/Output devices, Computer memory & organization, Back-up devices" },
      { name: "Data Representation", details: "Characters, Integers & Fractions, Binary & Hexadecimal, Binary Arithmetic (addition, subtraction, division, multiplication), Signed & two's complement arithmetic, Floating point & normalized representation" },
      { name: "Boolean Algebra & Logic", details: "Boolean algebra, Truth tables, Venn diagrams" },
      { name: "Computer Architecture", details: "Basics of Digital Logic, Block structure of computers, Processor & I/O communication, Interrupts" },
      { name: "Database Fundamentals", details: "Basic database concepts, Relational model, SQL basics, Keys & normalization" },
      { name: "Problem Solving & Programming", details: "Programming concepts, Control flow, Functions, Arrays, Data types, Problem-solving approaches" },
    ],
  },
  {
    subject: "Mathematics & Statistics",
    icon: MathOperations,
    color: "#0369A1",
    topics: [
      { name: "Algebra", details: "Fundamental operations, Expansion & Factorization, Quadratic equations, Indices, Logarithms, AP/GP/HP, Binomial theorem, Permutations & Combinations" },
      { name: "Co-ordinate Geometry", details: "Rectangular Cartesian co-ordinates, Equations of a line, Midpoint & intersections, Equations of a circle, Distance formulae, Pair of straight lines, Parabola, Ellipse & Hyperbola, Translation, Rotation & Scaling" },
      { name: "Trigonometry", details: "Simple identities, Trigonometric equations, Properties of triangles, Solution of triangles, Height & distance, Inverse functions" },
      { name: "Probability & Statistics", details: "Basic concepts of probability theory, Random variables, Distributions" },
      { name: "Mensuration", details: "Areas of triangles & quadrilaterals, Circumference of circles, Volumes & surface areas of cubes, spheres, cylinders & cones" },
    ],
  },
  {
    subject: "Quantitative Aptitude & Logical Ability",
    icon: ChartBar,
    color: "#7C3AED",
    topics: [
      { name: "Logical Reasoning", details: "Questions to measure how quickly and logically you can think — logical situations based on facts in a passage" },
      { name: "Problem Solving", details: "Analytical problem-solving capability — number series, patterns, coding-decoding, data interpretation" },
      { name: "Quantitative Aptitude", details: "Graduate-level quantitative questions — arithmetic, algebra applications, data analysis" },
    ],
  },
  {
    subject: "English",
    icon: Translate,
    color: "#B45309",
    topics: [
      { name: "Basic Grammar", details: "Tenses, Subject-Verb Agreement, Articles, Prepositions, Voice, Narration" },
      { name: "Vocabulary", details: "Synonyms, Antonyms, Word & Phrases, Idioms" },
      { name: "Comprehension", details: "Passage-based questions, Inference, Main idea identification" },
      { name: "Sentence Skills", details: "Sentence correction, Jumbled paragraphs, Error spotting" },
    ],
  },
  {
    subject: "General Knowledge",
    icon: Newspaper,
    color: "#6D28D9",
    topics: [
      { name: "Current Affairs", details: "National & international events, Government policies, Science & technology developments, Sports, Awards" },
    ],
  },
];

const prepTimeline = [
  {
    phase: "6 Months Before",
    title: "Build Foundations",
    description: "Cover the complete syllabus systematically. Focus on understanding core concepts in Mathematics and Computer Science. Start with your weakest areas.",
    tasks: ["Complete syllabus reading", "Make concise notes", "Solve textbook exercises", "Identify weak areas"],
    icon: BookOpenText,
  },
  {
    phase: "3 Months Before",
    title: "Deep Practice",
    description: "Intensive problem-solving phase. Work through previous year papers and topic-wise question banks. Focus on speed and accuracy.",
    tasks: ["Solve previous year papers", "Practice MCQs daily", "Time yourself on sections", "Revise notes weekly"],
    icon: Target,
  },
  {
    phase: "1 Month Before",
    title: "Mock Tests & Revision",
    description: "Take full-length mock tests under exam conditions. Analyze mistakes and revise high-weightage topics. Fine-tune your exam strategy.",
    tasks: ["2–3 full mocks per week", "Analyze every mistake", "Revise formulas & shortcuts", "Strengthen strong areas"],
    icon: Timer,
  },
  {
    phase: "Last Week",
    title: "Final Polish",
    description: "Light revision only. Focus on boosting confidence, not learning new topics. Review key formulas and rest well before the exam.",
    tasks: ["Revise formula sheets", "Quick recap of weak areas", "Stay calm & positive", "Get proper rest"],
    icon: Trophy,
  },
];

const recommendedBooks = [
  { title: "Discrete Mathematics", author: "Tremblay & Manohar", for: "Mathematics" },
  { title: "Data Structures", author: "Seymour Lipschutz (Schaum's)", for: "Computer Science" },
  { title: "Let Us C", author: "Yashavant Kanetkar", for: "C Programming" },
  { title: "Programming in ANSI C", author: "E. Balaguruswamy", for: "C Programming" },
  { title: "Quantitative Aptitude", author: "R.S. Aggarwal", for: "Analytical Ability" },
  { title: "Objective General English", author: "S.P. Bakshi", for: "English" },
  { title: "Operating System Concepts", author: "Silberschatz, Galvin & Gagne", for: "OS" },
  { title: "Database System Concepts", author: "Korth & Sudarshan", for: "DBMS" },
];

const onlineResources = {
  computerScience: [
    { name: "GfG — Data Structures & Algorithms", url: "https://www.geeksforgeeks.org/dsa/dsa-tutorial-learn-data-structures-and-algorithms/", tag: "DSA" },
    { name: "GfG — C Programming", url: "https://www.geeksforgeeks.org/c/c-programming-language/", tag: "Programming" },
    { name: "GfG — DBMS Tutorial", url: "https://www.geeksforgeeks.org/dbms/dbms/", tag: "DBMS" },
    { name: "GfG — Computer Organization", url: "https://www.geeksforgeeks.org/computer-organization-architecture/computer-organization-and-architecture-tutorials/", tag: "Architecture" },
    { name: "GfG — Operating Systems", url: "https://www.geeksforgeeks.org/operating-systems/operating-systems/", tag: "OS" },
    { name: "GfG — Computer Networks", url: "https://www.geeksforgeeks.org/computer-networks/computer-network-tutorials/", tag: "Networks" },
    { name: "GfG — Digital Logic", url: "https://www.geeksforgeeks.org/digital-logic/digital-electronics-logic-design-tutorials/", tag: "Logic Gates" },
    { name: "Tutorialspoint — Computer Fundamentals", url: "https://www.tutorialspoint.com/computer_fundamentals/index.htm", tag: "Basics" },
  ],
  mathematics: [
    { name: "GfG — Discrete Mathematics", url: "https://www.geeksforgeeks.org/engineering-mathematics/discrete-mathematics-tutorial/", tag: "Discrete Math" },
    { name: "GfG — Engineering Mathematics", url: "https://www.geeksforgeeks.org/engineering-mathematics/engineering-mathematics-tutorials/", tag: "Math" },
    { name: "Khan Academy — Linear Algebra", url: "https://www.khanacademy.org/math/linear-algebra", tag: "Linear Algebra" },
    { name: "Khan Academy — Trigonometry", url: "https://www.khanacademy.org/math/trigonometry", tag: "Trigonometry" },
    { name: "Khan Academy — Probability & Statistics", url: "https://www.khanacademy.org/math/statistics-probability", tag: "Probability" },
    { name: "Khan Academy — Integral Calculus", url: "https://www.khanacademy.org/math/integral-calculus", tag: "Calculus" },
  ],
  aptitude: [
    { name: "IndiaBix — Quantitative Aptitude", url: "https://www.indiabix.com/aptitude/questions-and-answers/", tag: "Aptitude" },
    { name: "IndiaBix — Logical Reasoning", url: "https://www.indiabix.com/logical-reasoning/questions-and-answers/", tag: "Logic" },
    { name: "IndiaBix — Verbal Reasoning", url: "https://www.indiabix.com/verbal-reasoning/questions-and-answers/", tag: "Reasoning" },
    { name: "IndiaBix — Verbal Ability", url: "https://www.indiabix.com/verbal-ability/questions-and-answers/", tag: "English" },
  ],
  videoLectures: [
    { name: "NPTEL — Computer Science Courses", url: "https://nptel.ac.in/course.html", tag: "IIT Lectures" },
    { name: "Khan Academy — Math", url: "https://www.khanacademy.org/math", tag: "Video" },
  ],
};

const faqs = [
  {
    q: "Who is eligible for the LBS MCA Entrance Exam?",
    a: "Candidates who have passed BCA, B.Sc (Computer Science), B.Sc (IT), or any graduation degree with Mathematics at 10+2 level or at graduation level are eligible. Candidates must be Indian citizens. Keralites and Non-Keralites are both eligible, but only Keralites can claim reservation quota seats.",
  },
  {
    q: "When is the exam usually conducted?",
    a: "The LBS MCA entrance exam is typically conducted between June and July each year. Application forms are usually available from March–April on the LBS Centre website (www.lbscentre.kerala.gov.in). Admit cards are downloaded from the candidate's homepage on the same website.",
  },
  {
    q: "How is college allotment done?",
    a: "Allotment is managed through a Single Window System (SWS) by the Director, LBS Centre under supervision of the Director of Technical Education. You register college preferences online, and seats are allotted based on your rank, options, and eligible reservations. There are typically two regular allotments, followed by special/spot allotments if seats remain vacant.",
  },
  {
    q: "Can I join MCA without appearing for LBS?",
    a: "Yes — seats are categorized as Government (allotted via LBS rank), Management (filled by college management), and Lapsed (filled by institutions after LBS allotment ends). Management and lapsed seats in aided/self-financing colleges may not require LBS qualification, though policies vary by institution.",
  },
  {
    q: "What is the fee structure?",
    a: "For Government/Aided colleges, the fee is approximately Rs. 7,640 (subject to annual revision). For self-financing colleges, a token fee of Rs. 10,000 is collected during allotment as part of tuition. SC/ST/OEC candidates with fee concession pay a token amount of Rs. 1,000. Full fee details are published before the allotment process.",
  },
  {
    q: "Is there negative marking?",
    a: "No — there is no negative marking. Each correct answer carries 1 mark, and no marks are deducted for wrong answers. More than one answer marked against a question is treated as incorrect. Unanswered questions carry zero marks.",
  },
  {
    q: "How are ties resolved in the rank list?",
    a: "If candidates have equal total marks: (1) Higher marks in Computer Science section gets preference, (2) then higher marks in Mathematics & Statistics, (3) then higher marks in Quantitative Aptitude & Logical Ability, (4) if still tied, the elder candidate is placed higher.",
  },
  {
    q: "How many colleges participate in the allotment?",
    a: "Over 40 colleges across Kerala participate in the centralized allotment — including 3 Government colleges (CET Trivandrum, GEC Thrissur, RIT Kottayam), 2 Aided colleges, 4 Government Cost-Sharing colleges, and 35+ Self-Financing colleges affiliated to KTU, MG University, Kerala University, and Kannur University.",
  },
];

const studyMaterials = [
  {
    category: "Computer Science",
    icon: Brain,
    color: "#047857",
    files: [
      { name: "Computer MCQs — 600 Questions", file: "computer-mcq-600.pdf" },
      { name: "Computer Basics", file: "computer-basics.pdf" },
      { name: "Computer Fundamentals MCQs", file: "computer-fundamentals-mcqs.pdf" },
      { name: "Computer Fundamentals Test", file: "computer-fundamentals-test.pdf" },
      { name: "Computer Knowledge MCQ", file: "computer-knowledge-mcq.pdf" },
      { name: "Computer MCQs — Miscellaneous", file: "computer-mcq-misc.pdf" },
      { name: "Computer Memory", file: "computer-memory.pdf" },
      { name: "Computer MCQs — 120 Questions", file: "computer-mcq-120.pdf" },
      { name: "MCQs on Computer", file: "computer-mcqs-collection.pdf" },
      { name: "Computer MCQs — 100 Questions", file: "computer-100-mcqs.docx" },
      { name: "Computer Fundamentals — 300 Questions", file: "computer-fundamentals-300.docx" },
      { name: "Fundamentals of Computer — Question Bank", file: "computer-fundamentals-qb.pdf" },
      { name: "MS Excel", file: "ms-excel.pdf" },
      { name: "MS Access", file: "ms-access.pdf" },
    ],
    folder: "computer-science",
  },
  {
    category: "Database Management Systems",
    icon: Database,
    color: "#0369A1",
    files: [
      { name: "Database Objective — 96 Questions", file: "database-objective-96.docx" },
      { name: "DBMS MCQs — 100 Questions", file: "dbms-100-mcq.pdf" },
      { name: "DBMS MCQs — 79 Questions", file: "dbms-79-mcq.pdf" },
    ],
    folder: "dbms",
  },
  {
    category: "Logical Reasoning & Quantitative Aptitude",
    icon: ChartBar,
    color: "#7C3AED",
    files: [
      { name: "QA & Logic — Part 1", file: "qa-logic-part-1.pdf" },
      { name: "QA & Logic — Part 2", file: "qa-logic-part-2.pdf" },
      { name: "QA & Logic — Part 3", file: "qa-logic-part-3.pdf" },
      { name: "QA & Logic — Part 4", file: "qa-logic-part-4.pdf" },
      { name: "QA & Logic — Part 5", file: "qa-logic-part-5.pdf" },
    ],
    folder: "logical-reasoning",
  },
  {
    category: "Mathematics",
    icon: MathOperations,
    color: "#0369A1",
    files: [
      { name: "3D Geometry", file: "3d-geometry.pdf" },
      { name: "Application of Integrals", file: "application-of-integrals.pdf" },
      { name: "Complex Numbers & Quadratic Equations", file: "complex-numbers.pdf" },
      { name: "Integrals", file: "integrals.pdf" },
      { name: "Inverse Trigonometric Functions", file: "inverse-trigonometry.pdf" },
      { name: "Linear Inequality", file: "linear-inequality.pdf" },
      { name: "Permutation & Combination", file: "permutation-combination.pdf" },
      { name: "Relations & Functions", file: "relations-functions-1.pdf" },
      { name: "Relations & Functions (Set 2)", file: "relations-functions-2.pdf" },
      { name: "Set Theory", file: "set-theory.pdf" },
      { name: "Trigonometric Functions", file: "trigonometry.pdf" },
      { name: "Vector Algebra", file: "vector-algebra.pdf" },
    ],
    folder: "mathematics",
  },
  {
    category: "Statistics & Probability",
    icon: ChartBar,
    color: "#B45309",
    files: [
      { name: "Probability", file: "probability.pdf" },
    ],
    folder: "statistics",
  },
];

/* ─── Animated helpers ─── */

function AccordionContent({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }, opacity: { duration: 0.2 } }}
      className="overflow-hidden"
    >
      {children}
    </motion.div>
  );
}

function FadeInSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─── Component ─── */

export default function Entrance() {
  const navigate = useNavigate();
  const [openSyllabus, setOpenSyllabus] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openMaterial, setOpenMaterial] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-bg">
      <Helmet>
        <title>LBS MCA Entrance Exam 2026 Kerala — Syllabus, Exam Pattern, Study Materials & Preparation Guide</title>
        <meta
          name="description"
          content="Complete LBS MCA entrance exam 2026 preparation guide — official syllabus, exam pattern (120 MCQs, no negative marking), free study materials & PDFs, preparation strategy, recommended books, previous year papers, and FAQs. Kerala MCA admission guide by ASIET MCA Department, Kalady."
        />
        <meta
          name="keywords"
          content="LBS MCA entrance exam 2026, LBS MCA entrance exam Kerala, LBS entrance exam 2026, MCA entrance exam Kerala 2026, Kerala MCA admission 2026, LBS Centre MCA entrance, LBS MCA exam pattern, LBS MCA syllabus, MCA entrance syllabus Kerala, LBS MCA entrance preparation, MCA entrance study materials, LBS MCA previous year papers, LBS MCA mock test, MCA entrance books, Kerala CEE MCA allotment, MCA entrance coaching Kerala, LBS MCA rank, LBS MCA cut off, LBS entrance exam date 2026, MCA entrance no negative marking, LBS MCA computer science syllabus, LBS MCA mathematics syllabus, MCA entrance aptitude questions, MCA admission process Kerala, ASIET MCA admission 2026, ASIET MCA Kalady, best MCA colleges Kerala, KTU MCA admission, MCA entrance online preparation, free MCA entrance study material, LBS MCA entrance registration, LBS Centre science technology Kerala, MCA entrance question bank, LBS MCA entrance exam tips, how to prepare for LBS MCA entrance"
        />
        <link rel="canonical" href="https://asiet-mca.github.io/entrance" />
        <meta property="og:title" content="LBS MCA Entrance Exam 2026 — Syllabus, Pattern & Free Study Materials | Kerala" />
        <meta
          property="og:description"
          content="Free preparation guide for Kerala LBS MCA Entrance 2026 — complete syllabus, exam pattern (120 MCQs, no negative marking), downloadable study materials, preparation strategy & FAQs."
        />
        <meta property="og:url" content="https://asiet-mca.github.io/entrance" />
        <meta name="twitter:title" content="LBS MCA Entrance Exam 2026 — Syllabus, Pattern & Free Study Materials | Kerala" />
        <meta
          name="twitter:description"
          content="Free preparation guide for Kerala LBS MCA Entrance 2026 — complete syllabus, exam pattern (120 MCQs, no negative marking), downloadable study materials, preparation strategy & FAQs."
        />
        {/* FAQ Schema for Google Rich Results */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        })}</script>
        {/* Course Schema */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "LBS MCA Entrance Exam Preparation",
          "description": "Complete preparation guide for Kerala LBS MCA Entrance Exam — syllabus, exam pattern, study materials, and preparation strategy",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "ASIET MCA Department",
            "url": "https://asiet-mca.github.io"
          },
          "educationalLevel": "Postgraduate entrance",
          "about": {
            "@type": "Thing",
            "name": "LBS MCA Entrance Examination Kerala"
          },
          "inLanguage": "en",
          "isAccessibleForFree": true
        })}</script>
      </Helmet>

      {/* ─── Top bar ─── */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/images/logos/asiet-logo.webp" alt="ASIET" className="h-6 w-auto sm:h-7" />
            <div className="h-4 w-px bg-border" />
            <span className="text-[11px] font-medium tracking-wide text-accent uppercase sm:text-[12px]">
              MCA
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              aria-label="Home"
              className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[11px] font-medium text-text-secondary transition-colors hover:bg-hover sm:px-3 sm:text-[12px]"
            >
              <House size={13} weight="duotone" />
              <span className="hidden sm:inline">Home</span>
            </button>
            <button
              onClick={() => navigate("/explorer")}
              className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-accent-light sm:px-3.5 sm:text-[12px]"
            >
              <FolderSimple size={14} weight="duotone" />
              File Explorer
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ─── Hero ─── */}
        <section className="relative border-b border-border overflow-hidden bg-gradient-to-br from-[#0C4A6E] via-[#0E5A85] to-[#0369A1]">
          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative mx-auto max-w-5xl px-4 pt-10 pb-8 sm:px-6 sm:pt-16 sm:pb-14">
            <div
              className="animate-fade-up inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-medium text-sky-100 backdrop-blur-sm sm:text-[11px]"
              style={{ animationDelay: "0ms" }}
            >
              <GraduationCap size={13} weight="duotone" />
              Kerala LBS MCA Entrance Exam
            </div>
            <h1
              className="animate-fade-up mt-4 max-w-2xl font-display text-[1.75rem] font-medium leading-[1.2] tracking-tight text-white sm:mt-5 sm:text-[2.5rem] sm:leading-[1.15]"
              style={{ animationDelay: "80ms" }}
            >
              MCA Entrance Exam Resources
            </h1>
            <p
              className="animate-fade-up mt-3 max-w-lg text-[13px] leading-relaxed text-sky-100/90 sm:mt-4 sm:text-[15px]"
              style={{ animationDelay: "160ms" }}
            >
              Everything you need to prepare for the LBS entrance exam — syllabus, exam
              pattern, preparation strategy, recommended books, and frequently asked
              questions.
            </p>
            <div
              className="animate-fade-up mt-6 flex flex-wrap gap-3 sm:mt-8"
              style={{ animationDelay: "240ms" }}
            >
              {[
                { label: "Exam Pattern", href: "#pattern" },
                { label: "Syllabus", href: "#syllabus" },
                { label: "Study Materials", href: "#materials" },
                { label: "Prep Strategy", href: "#strategy" },
                { label: "Resources", href: "#resources" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-lg border border-white/20 px-3.5 py-1.5 text-[11px] font-medium text-white/90 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white sm:text-[12px]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ─── About the Exam ─── */}
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
              <BookBookmark size={13} weight="duotone" className="text-accent" />
              About the Exam
            </div>
            <div className="mt-5 grid gap-5 sm:mt-6 md:grid-cols-[1fr_auto]">
              <div>
                <h2 className="font-display text-[18px] font-medium text-text-primary sm:text-[20px]">
                  LBS MCA Entrance Examination
                </h2>
                <p className="mt-2.5 text-[13px] leading-relaxed text-text-secondary sm:text-[14px]">
                  The LBS (Lal Bahadur Shastri Centre for Science & Technology) MCA
                  Entrance Exam is the qualifying examination for admission to the
                  two-year Master of Computer Applications (MCA) programme across Kerala.
                  Conducted by the Director, LBS Centre under the Government of Kerala
                  and supervised by the Director of Technical Education, this exam
                  determines eligibility and ranking for centralized allotment to
                  government, aided, and self-financing colleges across the state.
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-text-secondary sm:text-[14px]">
                  Allotment is done through a Single Window System (SWS) managed by
                  the LBS Centre. Based on your entrance rank and the college preferences
                  you submit online, seats are allotted across 40+ participating colleges.
                  Exam centres are typically located in Thiruvananthapuram, Ernakulam,
                  and Kozhikode.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5 md:flex-col md:gap-2">
                {[
                  { label: "Conducted by", value: "Director, LBS Centre" },
                  { label: "Supervised by", value: "Director of Technical Education" },
                  { label: "Exam Type", value: "OMR-based Objective MCQ" },
                  { label: "Usual Month", value: "June – July" },
                  { label: "Centres", value: "TVM, Ernakulam, Kozhikode" },
                  { label: "Colleges", value: "40+ across Kerala" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-border bg-bg px-3 py-2 sm:px-3.5 sm:py-2.5 md:min-w-[200px]"
                  >
                    <div className="text-[10px] font-medium tracking-wide text-text-quaternary uppercase">
                      {item.label}
                    </div>
                    <div className="mt-0.5 text-[12px] font-medium text-text-primary sm:text-[13px]">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Exam Pattern ─── */}
        <section id="pattern" className="scroll-mt-4 border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
              <Exam size={13} weight="duotone" className="text-accent" />
              Exam Pattern
            </div>

            {/* Quick stats */}
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-6 sm:grid-cols-4 sm:gap-3">
              {[
                { icon: Clock, label: "Duration", value: "2 Hours" },
                { icon: ListChecks, label: "Total Questions", value: "120 MCQs" },
                { icon: Scales, label: "Total Marks", value: "120" },
                { icon: Lightning, label: "Marking", value: "1 mark each" },
              ].map((stat, i) => (
                <FadeInSection key={stat.label} delay={i * 0.08}>
                  <div className="rounded-lg border border-border bg-surface px-3 py-3 sm:px-4 sm:py-3.5">
                    <stat.icon size={16} weight="duotone" className="text-accent" />
                    <div className="mt-2 font-display text-[18px] font-semibold text-text-primary sm:text-[20px]">
                      {stat.value}
                    </div>
                    <div className="mt-0.5 text-[11px] text-text-tertiary">{stat.label}</div>
                  </div>
                </FadeInSection>
              ))}
            </div>

            {/* Section breakdown */}
            <div className="mt-5 sm:mt-6">
              <div className="text-[12px] font-medium text-text-primary">
                Section-wise Breakdown
              </div>
              <div className="mt-3 space-y-2">
                {examSections.map((sec) => {
                  const percentage = (sec.questions / 120) * 100;
                  return (
                    <div
                      key={sec.subject}
                      className="rounded-lg border border-border bg-surface p-3 sm:p-3.5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <sec.icon
                            size={15}
                            weight="duotone"
                            style={{ color: sec.color }}
                            className="shrink-0"
                          />
                          <span className="text-[13px] font-medium text-text-primary truncate">
                            {sec.subject}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono text-[11px] text-text-tertiary">
                            {sec.questions} Qs
                          </span>
                          <span className="font-mono text-[11px] font-medium text-text-secondary">
                            {sec.marks} marks
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg">
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
                          style={{ backgroundColor: sec.color, opacity: 0.7 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-[11px] text-text-tertiary sm:text-[12px]">
                1 mark for each correct answer. No negative marking — no deduction for
                wrong answers. OMR-based objective type (ball point pen only).
              </p>
            </div>
          </div>
        </section>

        {/* ─── Syllabus ─── */}
        <section id="syllabus" className="scroll-mt-4 border-b border-border bg-surface">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
              <Books size={13} weight="duotone" className="text-accent" />
              Syllabus Breakdown
            </div>
            <p className="mt-2 text-[12px] text-text-tertiary sm:text-[13px]">
              Click on each subject to view the detailed topic list.
            </p>
            <div className="mt-5 space-y-2 sm:mt-6">
              {syllabus.map((section, idx) => {
                const isOpen = openSyllabus === idx;
                return (
                  <div
                    key={section.subject}
                    className="rounded-lg border border-border"
                  >
                    <button
                      onClick={() => setOpenSyllabus(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-hover sm:py-3.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <section.icon
                          size={16}
                          weight="duotone"
                          style={{ color: section.color }}
                          className="shrink-0"
                        />
                        <span className="text-[13px] font-medium text-text-primary sm:text-[14px]">
                          {section.subject}
                        </span>
                        <span className="hidden shrink-0 rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10px] text-text-quaternary sm:inline">
                          {section.topics.length} topics
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <CaretDown size={14} weight="bold" className="text-text-quaternary" />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <AccordionContent>
                          <div className="border-t border-border bg-bg px-4 py-3 sm:py-4">
                            <div className="space-y-2.5">
                              {section.topics.map((topic, tIdx) => (
                                <motion.div
                                  key={topic.name}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.25, delay: tIdx * 0.04 }}
                                >
                                  <div className="text-[13px] font-medium text-text-primary">
                                    {topic.name}
                                  </div>
                                  <div className="mt-0.5 text-[12px] leading-relaxed text-text-tertiary">
                                    {topic.details}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </AccordionContent>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Preparation Strategy ─── */}
        <section id="strategy" className="scroll-mt-4 border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
              <CalendarCheck size={13} weight="duotone" className="text-accent" />
              Preparation Strategy
            </div>
            <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 md:grid-cols-2">
              {prepTimeline.map((step, idx) => (
                <FadeInSection key={step.phase} delay={idx * 0.1}>
                <div
                  className="rounded-xl border border-border bg-surface p-4 sm:p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-muted">
                      <step.icon size={16} weight="duotone" className="text-accent" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] font-medium text-accent uppercase sm:text-[11px]">
                        {step.phase}
                      </div>
                      <div className="text-[14px] font-medium text-text-primary sm:text-[15px]">
                        {step.title}
                      </div>
                    </div>
                  </div>
                  <p className="mt-2.5 text-[12px] leading-relaxed text-text-secondary sm:text-[13px]">
                    {step.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {step.tasks.map((task) => (
                      <span
                        key={task}
                        className="rounded border border-border bg-bg px-2 py-0.5 text-[10px] text-text-tertiary sm:text-[11px]"
                      >
                        {task}
                      </span>
                    ))}
                  </div>
                  {/* Step number */}
                  <div className="mt-3 font-mono text-[10px] text-text-quaternary">
                    Step {idx + 1} of {prepTimeline.length}
                  </div>
                </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Study Materials (from KTU MCA Community) ─── */}
        <section id="materials" className="scroll-mt-4 border-b border-border bg-surface">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
              <DownloadSimple size={13} weight="duotone" className="text-accent" />
              Practice Materials
            </div>
            <p className="mt-2 text-[12px] text-text-tertiary sm:text-[13px]">
              35 downloadable MCQ sets and topic-wise PDFs. Click a category to browse and download.
            </p>
            <div className="mt-5 space-y-2 sm:mt-6">
              {studyMaterials.map((cat, idx) => {
                const isOpen = openMaterial === idx;
                return (
                  <div
                    key={cat.category}
                    className="rounded-lg border border-border"
                  >
                    <button
                      onClick={() => setOpenMaterial(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-hover sm:py-3.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <cat.icon
                          size={16}
                          weight="duotone"
                          style={{ color: cat.color }}
                          className="shrink-0"
                        />
                        <span className="text-[13px] font-medium text-text-primary sm:text-[14px]">
                          {cat.category}
                        </span>
                        <span className="hidden shrink-0 rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10px] text-text-quaternary sm:inline">
                          {cat.files.length} {cat.files.length === 1 ? "file" : "files"}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <CaretDown size={14} weight="bold" className="text-text-quaternary" />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <AccordionContent>
                          <div className="border-t border-border bg-bg px-4 py-3 sm:py-4">
                            <div className="grid gap-1.5 sm:grid-cols-2">
                              {cat.files.map((file, fIdx) => {
                                const isPdf = file.file.endsWith(".pdf");
                                const url = `/materials/entrance/${cat.folder}/${file.file}`;
                                return (
                                  <motion.a
                                    key={file.file}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: fIdx * 0.025 }}
                                    className="group flex items-center gap-2.5 rounded-md border border-border bg-surface px-3 py-2 transition-colors hover:border-accent/20 hover:shadow-sm"
                                  >
                                    {isPdf ? (
                                      <FilePdf size={15} weight="duotone" className="shrink-0 text-red-500/70" />
                                    ) : (
                                      <FileDoc size={15} weight="duotone" className="shrink-0 text-blue-500/70" />
                                    )}
                                    <span className="min-w-0 flex-1 truncate text-[12px] text-text-secondary group-hover:text-text-primary sm:text-[13px]">
                                      {file.name}
                                    </span>
                                    <DownloadSimple
                                      size={13}
                                      weight="bold"
                                      className="shrink-0 text-text-quaternary opacity-0 transition-opacity group-hover:opacity-100"
                                    />
                                  </motion.a>
                                );
                              })}
                            </div>
                          </div>
                        </AccordionContent>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[10px] text-text-quaternary sm:text-[11px]">
              Curated practice materials for MCA entrance preparation.
            </p>
          </div>
        </section>

        {/* ─── Recommended Resources ─── */}
        <section id="resources" className="scroll-mt-4 border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
              <BookOpenText size={13} weight="duotone" className="text-accent" />
              Recommended Resources
            </div>

            {/* Books */}
            <div className="mt-5 sm:mt-6">
              <div className="text-[12px] font-medium text-text-primary">
                Books
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {recommendedBooks.map((book) => (
                  <div
                    key={book.title}
                    className="flex items-start gap-3 rounded-lg border border-border bg-bg p-3 sm:p-3.5"
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded bg-accent-muted">
                      <BookBookmark size={14} weight="duotone" className="text-accent" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-text-primary">
                        {book.title}
                      </div>
                      <div className="text-[11px] text-text-tertiary">
                        {book.author}
                      </div>
                      <div className="mt-1 inline-block rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[9px] text-text-quaternary">
                        {book.for}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Online resources — categorized with links */}
            {[
              { title: "Computer Science", items: onlineResources.computerScience },
              { title: "Mathematics & Statistics", items: onlineResources.mathematics },
              { title: "Aptitude, Reasoning & English", items: onlineResources.aptitude },
              { title: "Video Lectures", items: onlineResources.videoLectures },
            ].map((group) => (
              <div key={group.title} className="mt-6 sm:mt-7">
                <div className="text-[12px] font-medium text-text-primary">
                  {group.title}
                </div>
                <div className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
                  {group.items.map((res) => (
                    <a
                      key={res.name}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-2 rounded-lg border border-border bg-bg p-2.5 transition-colors hover:border-accent/20 hover:shadow-sm sm:p-3"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <ArrowUpRight
                          size={12}
                          weight="bold"
                          className="shrink-0 text-text-quaternary transition-transform group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                        <span className="truncate text-[12px] font-medium text-text-secondary group-hover:text-text-primary sm:text-[13px]">
                          {res.name}
                        </span>
                      </div>
                      <span className="shrink-0 rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[9px] text-text-quaternary">
                        {res.tag}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Important Links ─── */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
            <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
              <ArrowUpRight size={13} weight="duotone" className="text-accent" />
              Important Links
            </div>
            <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-3 sm:gap-3">
              {[
                {
                  name: "LBS Centre for Science & Technology",
                  description: "Official exam notifications, applications & results",
                  url: "https://www.lbscentre.kerala.gov.in",
                },
                {
                  name: "CEE Kerala",
                  description: "Centralised allotment process & seat matrix",
                  url: "https://www.cee.kerala.gov.in",
                },
                {
                  name: "ASIET Admissions",
                  description: "Adi Shankara Institute admission details & contact",
                  url: "https://www.adishankara.ac.in/admission",
                },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-lg border border-border bg-surface p-3.5 transition-colors hover:border-accent/20 hover:shadow-sm sm:p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-text-primary group-hover:text-accent">
                      {link.name}
                    </span>
                    <ArrowUpRight
                      size={13}
                      weight="bold"
                      className="shrink-0 text-text-quaternary transition-transform group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </div>
                  <div className="mt-1 text-[12px] text-text-tertiary">
                    {link.description}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
              <Question size={13} weight="duotone" className="text-accent" />
              Frequently Asked Questions
            </div>
            <div className="mt-5 space-y-2 sm:mt-6">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-lg border border-border"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-hover sm:py-3.5"
                    >
                      <span className="text-[13px] font-medium text-text-primary sm:text-[14px]">
                        {faq.q}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <CaretDown size={14} weight="bold" className="text-text-quaternary" />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <AccordionContent>
                          <div className="border-t border-border bg-bg px-4 py-3 sm:py-4">
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2, delay: 0.1 }}
                              className="text-[13px] leading-relaxed text-text-secondary"
                            >
                              {faq.a}
                            </motion.p>
                          </div>
                        </AccordionContent>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="rounded-xl border border-accent/15 bg-accent-muted/40 p-5 text-center sm:p-8">
              <GraduationCap size={28} weight="duotone" className="mx-auto text-accent" />
              <h2 className="mt-3 font-display text-[18px] font-medium text-text-primary sm:text-[22px]">
                Already admitted to ASIET MCA?
              </h2>
              <p className="mx-auto mt-2 max-w-md text-[13px] text-text-secondary sm:text-[14px]">
                Access course materials, notes, question papers, and lab records organized
                semester-wise for your MCA programme.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                <button
                  onClick={() => navigate("/explorer")}
                  className="group flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-accent-light sm:px-5 sm:py-2.5 sm:text-[13px]"
                >
                  <FolderSimple size={14} weight="duotone" />
                  Browse Course Materials
                  <ArrowRight
                    size={13}
                    weight="bold"
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>
                <a
                  href="https://www.adishankara.ac.in/department/computer-applications"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-[12px] font-medium text-text-secondary transition-colors hover:bg-hover sm:px-5 sm:py-2.5 sm:text-[13px]"
                >
                  Visit ASIET MCA
                  <ArrowUpRight size={13} weight="bold" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="bg-surface border-t border-border">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="flex flex-col justify-between gap-5 sm:gap-6 md:flex-row md:items-start">
            <div className="flex items-center gap-3">
              <img
                src="/logo.webp"
                alt="ASIET"
                className="h-9 w-9 shrink-0 object-contain md:hidden"
              />
              <img
                src="/images/logos/asiet-footer-logo.webp"
                alt="ASIET"
                className="hidden h-10 w-auto opacity-80 md:block"
              />
              <div className="min-w-0">
                <div className="font-display text-[13px] font-semibold text-text-primary">
                  Adi Shankara Institute of Engineering & Technology
                </div>
                <div className="mt-0.5 text-[11px] text-text-tertiary sm:mt-1 sm:text-[12px]">
                  Department of Computer Applications (MCA)
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 text-[11px] text-text-tertiary sm:gap-2 sm:text-[12px] md:items-end">
              <div className="flex items-center gap-1.5">
                <MapPin size={12} weight="bold" className="shrink-0 text-text-quaternary" />
                Vidya Bharathi Nagar, Kalady, Ernakulam, Kerala 683574
              </div>
              <div className="flex items-center gap-1.5">
                <Phone size={12} weight="bold" className="shrink-0 text-text-quaternary" />
                0484-2463825
              </div>
              <div className="flex items-center gap-1.5">
                <EnvelopeSimple size={12} weight="bold" className="shrink-0 text-text-quaternary" />
                info@adishankara.ac.in
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-border-subtle pt-3 text-[10px] text-text-quaternary sm:mt-6 sm:pt-4 sm:text-[11px]">
            <span>MCA Entrance Resources — By ASIET MCA Department</span>
            <button
              onClick={() => navigate("/")}
              className="text-text-quaternary transition-colors hover:text-accent"
            >
              Back to Home
            </button>
          </div>
          <a
            href="https://ebin.pro"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block text-center font-mono text-[8px] tracking-wide text-text-quaternary/50 transition-all duration-700 hover:tracking-[0.3em] hover:text-accent/70 sm:mt-4"
          >
            // eb
          </a>
        </div>
      </footer>
    </div>
  );
}
