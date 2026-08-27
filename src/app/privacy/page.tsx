"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// --- PRIVACY POLICY CONTENT DATA ---
const privacyData = [
  {
    id: "information-collection",
    title: "1. Information Collection & Processing",
    points: [
      "ZTIW collects voluntary text prompts, conversational queries, and system instructions entered into the 5onam AI terminal.",
      "Uploaded documents (PDFs, CSVs, TXTs) and images are temporarily parsed by the system for multimodal analysis.",
      "Basic session telemetry and routing metrics are collected to maintain our heuristic failover architecture and uptime.",
      "Registration data, including full names and email addresses, is securely stored using our Supabase authentication backend.",
      "The platform strictly does not track keystrokes, screen activity, or background device processes outside of active interactions.",
    ],
  },
  {
    id: "data-persistence",
    title: "2. Data Persistence & Local Storage",
    points: [
      "5onam AI adheres to a strict data minimization protocol, storing active chat histories exclusively on the user's local device.",
      "ZTIW does not maintain centralized, persistent databases of user conversational logs on its primary corporate servers.",
      "The browser's Web Storage API (localStorage) is utilized to ensure users retain physical custody of their session data.",
      "Uploaded artifacts and files are purged from active server memory immediately after the generative AI cycle is completed.",
      "Users possess the ultimate capability to permanently erase all chat records simply by clearing their browser cache and storage.",
    ],
  },
  {
    id: "memory-vault",
    title: "3. The Neural Memory Vault",
    points: [
      "5onam AI features a Neural Memory Vault designed to selectively extract and retain user preferences and project context.",
      "Facts extracted by the agent are stored entirely client-side and are utilized solely to personalize future AI interactions.",
      "Users retain full transparency over this vault, with a dedicated UI to review every stored data point the AI has learned.",
      "Specific memories, or the entire vault, can be permanently deleted by the user at any given time with immediate effect.",
      "Personalized memory data is never sold, traded, or utilized for targeted advertising by Zen-Tech or its affiliates.",
    ],
  },
  {
    id: "api-routing",
    title: "4. Third-Party API Integration",
    points: [
      "5onam AI functions as an orchestration layer, securely routing user queries to authorized third-party generative endpoints.",
      "Partner models include APIs from Google (Gemini), OpenAI (GPT Series), Groq (Llama), and Pollinations (Vision/Media).",
      "Inputs are transiently processed by these external providers in strict accordance with their respective compliance frameworks.",
      "ZTIW actively filters payload headers to minimize identifiable tracking by upstream AI model providers.",
      "By utilizing this platform, users explicitly consent to this transient routing required to generate intelligent responses.",
    ],
  },
  {
    id: "prohibited-data",
    title: "5. Prohibited Data Submissions",
    points: [
      "Users must never input highly sensitive Personally Identifiable Information (PII) into the 5onam AI text inputs.",
      "Protected Health Information (PHI) subject to medical privacy laws is strictly prohibited from being processed on this platform.",
      "Classified corporate trade secrets, source code for internal security systems, or secure authentication credentials must not be shared.",
      "Unreleased financial data, credit card numbers, or government identification numbers violate our secure usage policies.",
      "ZTIW claims no liability for the accidental exposure of sensitive data that a user voluntarily submits against these directives.",
    ],
  },
  {
    id: "security",
    title: "6. Security & Cryptographic Protocols",
    points: [
      "ZTIW implements industry-standard HTTPS/TLS cryptographic protocols for all data in transit between the client and servers.",
      "Our Supabase architecture leverages Row Level Security (RLS) policies to isolate and protect user profile databases.",
      "Despite rigorous safeguards, no internet-based transmission system can guarantee absolute invulnerability against cyber threats.",
      "Users transmit custom prompts and upload proprietary documents to the 5onam AI platform at their own inherent risk.",
      "In the highly unlikely event of a confirmed data breach affecting profile emails, ZTIW will issue prompt notifications to affected users.",
    ],
  },
  {
    id: "cookies",
    title: "7. Cookies & Session Management",
    points: [
      "The platform utilizes strictly necessary session cookies to securely authenticate users and maintain login states.",
      "Functional cookies are deployed to remember specific user interface preferences, such as Dark Mode or Pookie Mode.",
      "ZTIW does not deploy invasive cross-site tracking pixels or third-party advertising cookies on the 5onam AI dashboard.",
      "Anonymous, aggregated usage statistics may be analyzed internally to improve UI/UX design and API routing efficiency.",
      "Users may configure browser settings to block all cookies, though this will immediately disrupt account authentication features.",
    ],
  },
  {
    id: "user-rights",
    title: "8. User Rights & Data Sovereignty",
    points: [
      "Users have the statutory right to request a complete export of their profile registration data stored on ZTIW servers.",
      "Account deletion requests can be initiated directly, resulting in the permanent removal of credentials from Supabase.",
      "Because conversational data is localized, users effectively exercise their right to be forgotten by clearing local browser storage.",
      "Global users maintain standard rights to object to data processing and request immediate rectifications of incorrect profile details.",
      "Formal compliance inquiries regarding data sovereignty rights can be directed to the Zen-Tech administration team.",
    ],
  },
  {
    id: "age-restriction",
    title: "9. Age Restrictions & Child Privacy",
    points: [
      "The 5onam AI platform is strictly not directed toward or intended for use by children under the age of 13.",
      "ZTIW does not knowingly collect or solicit registration information from minors without verifiable parental consent.",
      "If we discover an active account belongs to a minor under 13, it will be immediately terminated and purged from the database.",
      "Parents or legal guardians may contact administration to request the rapid deletion of a minor's unauthorized account.",
      "Users aged 13 to 17 are required to utilize the generative AI platform under the active supervision of a legal guardian.",
    ],
  },
  {
    id: "modifications",
    title: "10. Policy Modifications & Contact",
    points: [
      "ZTIW reserves the exclusive right to dynamically update this Privacy Policy to reflect evolving architectural or legal requirements.",
      "Significant modifications regarding user data handling practices will be communicated via platform dashboard announcements.",
      "Continued use of 5onam AI after policy updates signifies the user's binding, irrevocable acceptance of the newly established terms.",
      "The effective date of the current operational privacy policy will always be prominently displayed at the top of this document.",
      "All privacy-related inquiries and legal notices should be sent to our official channel at zentechindiaofficial@gmail.com.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("");

  // Scroll spy logic for Table of Contents
  useEffect(() => {
    const handleScroll = () => {
      let current = "";
      for (const section of privacyData) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjust threshold based on header height
          if (rect.top <= 200) {
            current = section.id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Accounts for the sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-800 font-sans selection:bg-purple-200 selection:text-purple-900">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-purple-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <Link href="/signup" className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors font-semibold text-sm">
          <ArrowLeft size={18} />
          Back to Signup
        </Link>
        <div className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
          5onam AI
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-16 flex flex-col-reverse lg:flex-row gap-10 lg:gap-16">
        
        {/* Left Side: 70% Content */}
        <div className="w-full lg:w-[70%]">
          <div className="mb-12 border-b border-gray-100 pb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-purple-600 font-semibold text-sm uppercase tracking-widest">
              Zen-Tech Intelligence Wing • Effective Date: March 2026
            </p>
          </div>

          <div className="space-y-16 text-gray-600 leading-relaxed">
            {privacyData.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-32">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-sm shadow-sm border border-purple-200 shrink-0">
                    {index + 1}
                  </span>
                  {section.title.split('. ')[1]}
                </h2>
                <ul className="space-y-4 pl-3">
                  {section.points.map((point, ptIndex) => (
                    <li key={ptIndex} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2.5 shrink-0"></span>
                      <span className="text-[15px]">{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>

        {/* Right Side: 30% Sticky Table of Contents */}
        <div className="w-full lg:w-[30%]">
          <div className="sticky top-28 p-6 bg-[#FAFAFA] border border-purple-100 rounded-2xl shadow-sm">
            <h3 className="text-xs font-extrabold text-purple-900 uppercase tracking-widest mb-5">
              Table of Contents
            </h3>
            <nav className="flex flex-col gap-3.5">
              {privacyData.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => scrollToSection(e, section.id)}
                  className={`text-[13px] font-medium transition-all duration-300 leading-snug ${
                    activeSection === section.id
                      ? "text-purple-700 translate-x-2 font-bold"
                      : "text-gray-500 hover:text-purple-500"
                  }`}
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </div>

      </div>
    </main>
  );
}