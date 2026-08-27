"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/utils/supabase/client";
import { 
  Send, Zap, Loader2, Code2, BrainCircuit, PenTool, 
  Layers, Bot, GitBranch, Layout, TerminalSquare, Cloud, 
  Box, User, CheckCircle2, Infinity, Clock, Timer, 
  Activity, ArrowRight
} from "lucide-react";

export default function LandingPage() {
  const [promptText, setPromptText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const router = useRouter();

  // --- DYNAMIC HEADING TYPEWRITER EFFECT ---
  const [headingText, setHeadingText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const capabilities = [
    "write full-stack code.",
    "generate stunning images.",
    "automate your workflows.",
    "architect Supabase databases.",
    "synthesize study modules.",
    "debug complex APIs.",
  ];

  useEffect(() => {
    const currentPhrase = capabilities[phraseIndex];
    let typingTimer: NodeJS.Timeout;

    if (isDeleting) {
      typingTimer = setTimeout(() => {
        setHeadingText(currentPhrase.substring(0, headingText.length - 1));
        if (headingText.length === 0) {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % capabilities.length);
        }
      }, 30); 
    } else {
      typingTimer = setTimeout(() => {
        setHeadingText(currentPhrase.substring(0, headingText.length + 1));
        if (headingText.length === currentPhrase.length) {
          typingTimer = setTimeout(() => setIsDeleting(true), 2500); 
        }
      }, 70); 
    }

    return () => clearTimeout(typingTimer);
  }, [headingText, isDeleting, phraseIndex]);

  // --- SUGGESTIONS ---
  const suggestions = [
    "Architect a Next.js medical ERP dashboard",
    "Generate a UI mockup for a SaaS platform",
    "Write a SQL schema for user authentication",
    "Summarize advanced networking concepts",
  ];

  const handleSuggestionClick = (text: string) => {
    setPromptText(text);
  };

  const handleEnhancePrompt = () => {
    if (isEnhancing || isProcessing) return;
    setIsEnhancing(true);

    setTimeout(() => {
      if (!promptText.trim()) {
        setPromptText("Act as an elite AI agent. Write a complete Next.js automation script that connects to a database, processes the data, and generates a visual chart, explaining each step clearly.");
      } else {
        setPromptText(`As an advanced AI agent specialized in coding, image synthesis, and automation, execute the following task with extreme precision. Provide production-ready output and step-by-step reasoning:\n\n"${promptText.trim()}"`);
      }
      setIsEnhancing(false);
    }, 800);
  };

  const handleSubmit = async () => {
    if (!promptText.trim() || isProcessing) return;
    setIsProcessing(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      localStorage.setItem("pending_5onam_prompt", promptText.trim());

      if (session) {
        router.push(`/mainpage?prompt=${encodeURIComponent(promptText.trim())}`);
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <main className="min-h-screen w-full relative flex flex-col font-sans text-white selection:bg-purple-500/30 bg-[#030305] overflow-hidden">
      
      {/* --- CRYSTAL CLEAR BACKGROUND --- */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] ease-linear hover:scale-105"
        style={{
          backgroundImage: 'url("https://i.ibb.co/bRJd6pYw/8d0cbdb5-ab77-4c80-b317-be178ffac8a0.png")',
        }}
      />
      {/* Vignette to keep text readable */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030305_95%)] pointer-events-none opacity-90"></div>
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#030305]/80 via-transparent to-[#030305] pointer-events-none"></div>

      {/* --- MINIMALIST NAVIGATION --- */}
      <nav className="relative z-50 w-full px-6 md:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer">
          <img
            src="https://www.image2url.com/r2/default/images/1776349470511-ca803856-3d27-4d2b-bc06-2e3ce2001fe1.png"
            alt="5onam AI Logo"
            className="h-7 w-auto object-contain brightness-0 invert"
          />
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/pricing" className="text-white/60 hover:text-white transition-colors">Pricing</Link>
          <Link href="/login" className="text-white/60 hover:text-white transition-colors">Sign In</Link>
          <Link 
            href="/signup" 
            className="bg-white text-black px-6 py-2.5 rounded-full hover:bg-gray-200 transition-all active:scale-95 font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* --- HERO / PROMPT SECTION --- */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 w-full max-w-5xl mx-auto pt-10 pb-20">
        <div className="w-full flex flex-col items-center justify-center mb-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-center leading-[1.1]">
            Deploy an AI agent to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 border-r-4 border-indigo-400 pr-2 animate-pulse drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              {headingText}
            </span>
          </h1>
        </div>

        <div className="w-full max-w-3xl flex flex-col items-center">
          <div className="w-full bg-[#0a0a0f]/60 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[24px] p-4 flex flex-col transition-all duration-300 focus-within:border-purple-500/50 focus-within:shadow-[0_0_50px_rgba(168,85,247,0.15)] group">
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the task you want to execute..."
              className="w-full bg-transparent text-white placeholder:text-white/40 outline-none resize-none min-h-[120px] text-lg p-3 font-medium leading-relaxed custom-scrollbar"
            />
            <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
              <button 
                onClick={handleEnhancePrompt}
                disabled={isEnhancing}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all flex items-center gap-2 group/btn active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEnhancing ? (
                  <Loader2 size={16} className="animate-spin text-purple-400" />
                ) : (
                  <Zap size={16} className="text-purple-400 group-hover/btn:text-purple-300 transition-colors" />
                )}
                <span className="text-sm font-semibold">
                  {isEnhancing ? "Optimizing..." : "Enhance"}
                </span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={isProcessing || !promptText.trim()}
                className={`p-3 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  promptText.trim() && !isProcessing
                    ? "bg-white text-black hover:bg-gray-200 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer"
                    : "bg-white/5 text-white/20 cursor-not-allowed"
                }`}
              >
                {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="ml-1" />}
              </button>
            </div>
          </div>
          <div className="w-full flex flex-wrap justify-center gap-3 mt-8">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 backdrop-blur-md text-xs font-medium text-white/70 hover:text-white transition-all truncate"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- EDGE-TO-EDGE CAPABILITIES SECTION --- */}
      <section className="relative z-10 w-full py-16 px-4 md:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-900/10 text-[10px] font-bold tracking-[0.2em] uppercase text-purple-300 mb-6 backdrop-blur-sm">
            POWERFUL CAPABILITIES
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
            Everything you need,<br />
            in one <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">intelligent agent.</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-xl leading-relaxed">
            5onam AI Agent is built to handle complex tasks across development, analysis, creativity, and automation.
          </p>
        </div>

        {/* --- 5-COLUMN EDGE-TO-EDGE GRID --- */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5 mb-16">
          
          {/* 1. Code & Debug */}
          <div className="bg-[#0b0b10] border border-white/5 rounded-[1.5rem] p-6 hover:border-purple-500/30 transition-all duration-300 flex flex-col shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-purple-900/20 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5">
              <Code2 size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Code & Debug</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6 flex-1">
              Write, review, and debug code in any language with ease.
            </p>
            {/* Python Code Mockup */}
            <div className="w-full bg-[#16161e] border border-white/5 rounded-xl p-4 text-[10px] font-mono leading-relaxed text-gray-300 shadow-inner">
              <div className="flex text-gray-500 mb-1 gap-2">
                <span className="w-3 text-right">1</span>
                <span><span className="text-pink-400">def</span> <span className="text-blue-300">fibonacci</span>(n):</span>
              </div>
              <div className="flex text-gray-500 mb-1 gap-2">
                <span className="w-3 text-right">2</span>
                <span>&nbsp;&nbsp;a, b = <span className="text-orange-300">0</span>, <span className="text-orange-300">1</span></span>
              </div>
              <div className="flex text-gray-500 mb-1 gap-2">
                <span className="w-3 text-right">3</span>
                <span>&nbsp;&nbsp;<span className="text-pink-400">while</span> a &lt; n:</span>
              </div>
              <div className="flex text-gray-500 mb-1 gap-2">
                <span className="w-3 text-right">4</span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;print(a, end=<span className="text-amber-300">' '</span>)</span>
              </div>
              <div className="flex text-gray-500 mb-1 gap-2">
                <span className="w-3 text-right">5</span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;a, b = b, a + b</span>
              </div>
              <div className="flex text-gray-500 gap-2">
                <span className="w-3 text-right">6</span>
                <span>&nbsp;&nbsp;<span className="text-pink-400">return</span></span>
              </div>
            </div>
          </div>

          {/* 2. Solve & Explain */}
          <div className="bg-[#0b0b10] border border-white/5 rounded-[1.5rem] p-6 hover:border-purple-500/30 transition-all duration-300 flex flex-col shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-purple-900/20 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5">
              <BrainCircuit size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Solve & Explain</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6 flex-1">
              Solve problems, explain concepts, and simplify complex topics.
            </p>
            {/* Chat Interface Mockup */}
            <div className="w-full flex flex-col gap-3 text-[10px]">
              <div className="self-end bg-white/10 px-3 py-2 rounded-xl rounded-tr-sm border border-white/5 text-gray-200">
                Explain Quantum Computing?
              </div>
              <div className="self-start bg-purple-900/20 border border-purple-500/20 px-3 py-2.5 rounded-xl rounded-tl-sm text-gray-300 flex items-start gap-2 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                <Bot size={12} className="shrink-0 text-purple-400 mt-0.5" />
                <span className="leading-relaxed">Quantum computing uses qubits instead of classical bits. It leverages superposition and entanglement to perform complex calculations exponentially faster.</span>
              </div>
            </div>
          </div>

          {/* 3. Create & Design */}
          <div className="bg-[#0b0b10] border border-white/5 rounded-[1.5rem] p-6 hover:border-purple-500/30 transition-all duration-300 flex flex-col shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-purple-900/20 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5">
              <PenTool size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Create & Design</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6 flex-1">
              Generate stunning images, graphics, and presentations instantly.
            </p>
            {/* Image Generation UI Mockup */}
            <div className="w-full h-36 bg-[#16161e] border border-white/5 rounded-xl overflow-hidden relative shadow-inner flex p-1.5 gap-1.5">
              {/* Sidebar Toolbar */}
              <div className="w-6 flex flex-col items-center gap-2 pt-2 text-gray-500 bg-black/40 rounded-lg">
                <div className="w-3 h-3 rounded-full border border-gray-500/50 flex items-center justify-center text-[6px]">T</div>
                <div className="w-3 h-3 border border-gray-500/50 rounded-sm"></div>
                <div className="w-3 h-3 rounded-full bg-gray-500/30"></div>
                <div className="w-3 h-3 bg-gradient-to-br from-gray-500/50 to-transparent rounded-sm"></div>
              </div>
              {/* Image Canvas */}
              <div className="flex-1 bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-lg relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 mix-blend-overlay"></div>
                <div className="w-16 h-8 bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse delay-75"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Integrations */}
          <div className="bg-[#0b0b10] border border-white/5 rounded-[1.5rem] p-6 hover:border-purple-500/30 transition-all duration-300 flex flex-col shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-purple-900/20 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5">
              <Layers size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Integrations</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6 flex-1">
              Seamlessly connect with tools, APIs, and platforms you use.
            </p>
            {/* Apps Grid Mockup */}
            <div className="w-full grid grid-cols-3 gap-3">
              <div className="aspect-square bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                <GitBranch size={18} className="text-white" />
              </div>
              <div className="aspect-square bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                <TerminalSquare size={18} className="text-blue-400" />
              </div>
              <div className="aspect-square bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                <Layout size={18} className="text-pink-400" />
              </div>
              <div className="aspect-square bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                <Box size={18} className="text-white" />
              </div>
              <div className="aspect-square bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                <Cloud size={18} className="text-amber-400" />
              </div>
              <div className="aspect-square bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer text-gray-500 text-xs font-bold tracking-widest">
                ...
              </div>
            </div>
          </div>

          {/* 5. Automate Tasks */}
          <div className="bg-[#0b0b10] border border-white/5 rounded-[1.5rem] p-6 hover:border-purple-500/30 transition-all duration-300 flex flex-col shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-purple-900/20 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5">
              <Zap size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Automate Tasks</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6 flex-1">
              Automate workflows and repetitive tasks to save time and focus.
            </p>
            {/* Timeline Mockup */}
            <div className="w-full flex flex-col gap-2 relative">
              <div className="absolute left-4 top-4 bottom-4 w-px bg-white/10"></div>
              
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-2.5 relative z-10">
                <div className="w-6 h-6 rounded-full bg-blue-900/50 flex items-center justify-center border border-blue-500/30">
                  <User size={10} className="text-blue-400" />
                </div>
                <span className="text-[10px] font-medium text-gray-300">User Request</span>
              </div>
              
              <div className="flex items-center gap-3 bg-purple-900/10 border border-purple-500/20 rounded-xl p-2.5 relative z-10 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                <div className="w-6 h-6 rounded-full bg-purple-900/50 flex items-center justify-center border border-purple-500/50 animate-pulse">
                  <Activity size={10} className="text-purple-400" />
                </div>
                <span className="text-[10px] font-medium text-gray-200">AI Processing</span>
              </div>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-2.5 relative z-10">
                <div className="w-6 h-6 rounded-full bg-emerald-900/50 flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 size={10} className="text-emerald-400" />
                </div>
                <span className="text-[10px] font-medium text-gray-400">Action Completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM STATS BANNER --- */}
        <div className="w-full max-w-6xl bg-[#0b0b10]/80 backdrop-blur-xl border border-purple-500/20 rounded-[1.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 shadow-[0_0_40px_rgba(168,85,247,0.1)] relative overflow-hidden">
          
          {/* Subtle Banner Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-transparent pointer-events-none" />

          {/* Left Text */}
          <div className="text-center md:text-left z-10">
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              One agent.<br />
              <span className="text-purple-500">Infinite capabilities.</span>
            </h3>
          </div>

          {/* Stats Blocks */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 md:gap-12 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-900/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <Infinity size={20} />
              </div>
              <div className="text-left">
                <p className="text-lg md:text-xl font-bold text-white leading-none mb-1">∞</p>
                <p className="text-xs text-gray-400 font-medium">Possibilities</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
                <Clock size={20} />
              </div>
              <div className="text-left">
                <p className="text-lg md:text-xl font-bold text-white leading-none mb-1">24/7</p>
                <p className="text-xs text-gray-400 font-medium">Always Available</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
                <Timer size={20} />
              </div>
              <div className="text-left">
                <p className="text-lg md:text-xl font-bold text-purple-300 leading-none mb-1">&lt; 1s</p>
                <p className="text-xs text-gray-400 font-medium">Blazing Fast</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
                <Layers size={20} />
              </div>
              <div className="text-left">
                <p className="text-lg md:text-xl font-bold text-white leading-none mb-1">100+</p>
                <p className="text-xs text-gray-400 font-medium">Integrations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Orb */}
        <div className="mt-16 w-full flex justify-center relative">
          <div className="absolute w-[400px] h-[100px] bg-purple-600/20 blur-[60px] rounded-full"></div>
          <div className="absolute w-[200px] h-[200px] border border-purple-500/20 rounded-full scale-x-[2.5] scale-y-[0.5] rotate-0"></div>
          <div className="absolute w-[300px] h-[300px] border border-purple-500/10 rounded-full scale-x-[3] scale-y-[0.6] rotate-0"></div>
          <div className="relative w-14 h-14 rounded-2xl bg-[#0a0a0f] border border-purple-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.5)] z-10">
            <Box size={24} className="text-purple-300" />
          </div>
        </div>

      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 w-full py-12 border-t border-white/5 flex flex-col items-center justify-center bg-[#030305]">
        <p className="text-sm font-medium text-gray-500 tracking-widest uppercase mb-4 text-center px-4">
          5ONAM AI &copy; AN AGENT OF Zen-Tech Intelligence Wing!
        </p>
      </footer>
      
    </main>
  );
}