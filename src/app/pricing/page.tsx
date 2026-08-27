"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/utils/supabase/client";
import { 
  CheckCircle2, X, Zap, Crown, Building2, 
  ArrowRight, Loader2, ShieldCheck, Menu, 
  GraduationCap, Briefcase, Plus, Cpu, HardDrive, 
  MonitorPlay, Globe
} from "lucide-react";

// Helper to load Razorpay SDK dynamically
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PricingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  // Check Authentication on Mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setIsLoadingAuth(false);
    };
    checkAuth();
  }, []);

  const pricingPlans = [
    {
      id: "academic",
      name: "Academic Core",
      badge: "Student & Learner",
      icon: <GraduationCap className="w-5 h-5 text-emerald-400" />,
      accent: "emerald",
      price: 0,
      bestFor: "Perfect for university coursework, exam prep, and introductory coding.",
      features: [
        "150 AI Prompts per month",
        "Standard Next.js & Python Code Gen",
        "Academic Study Module Synthesizer",
        "Basic Error Debugging & Tracing",
        "Standard Image Synthesis (720p)",
        "Astra Editor (Basic Tools)",
        "Standard Response Latency",
        "8K Context Memory Window",
        "Community Discord Support",
        "1 User Seat"
      ],
      missing: [
        "Automated Production Workflows",
        "Live Web Search Integrations",
      ],
      buttonText: "Start Learning Free",
      isPopular: false,
    },
    {
      id: "creator",
      name: "Visionary",
      badge: "Freelancer & Creator",
      icon: <MonitorPlay className="w-5 h-5 text-pink-400" />,
      accent: "pink",
      price: 999, // INR
      bestFor: "Solo developers and visual creators needing high-quality assets.",
      features: [
        "1,000 AI Prompts per month",
        "Advanced Full-Stack Architecting",
        "4K Image & Cinematic UI Gen",
        "Astra Editor (Pro Video/Filters)",
        "Basic Automation Scripts",
        "Live Search (100 queries/mo)",
        "Fast Response (< 2s Latency)",
        "32K Context Memory Window",
        "Email Support (24h SLA)",
        "Commercial License Rights",
        "1 User Seat"
      ],
      missing: [
        "Client White-labeling",
      ],
      buttonText: "Upgrade to Visionary",
      isPopular: false,
    },
    {
      id: "startup",
      name: "Launchpad",
      badge: "Small Business & Startup",
      icon: <Zap className="w-5 h-5 text-purple-400" />,
      accent: "purple",
      price: 2499, // INR
      bestFor: "Early-stage startups needing rapid product deployment and automation.",
      features: [
        "Unlimited Base Prompts",
        "Complex Database Schema Design",
        "Full Automated Daily Workflows",
        "Unlimited Live Web Research",
        "GitHub & Vercel Integrations",
        "API Access (10k calls/mo)",
        "Ultra-Fast Response (< 1s)",
        "128K Context Memory Window",
        "Priority Support (12h SLA)",
        "Shared Team Workspaces",
        "Up to 3 Team Seats included"
      ],
      missing: [],
      buttonText: "Scale your Startup",
      isPopular: true, // Highlights this card
    },
    {
      id: "agency",
      name: "Nexus Agency",
      badge: "IT & Production Houses",
      icon: <Briefcase className="w-5 h-5 text-blue-400" />,
      accent: "blue",
      price: 7999, // INR
      bestFor: "Agencies managing multiple clients, film production render farms, and high-volume coding.",
      features: [
        "Unlimited Advanced Prompts",
        "Multi-Project Client Dashboards",
        "White-label Reports & Exports",
        "Custom Brand Voice Tuning",
        "Cinematic Video Rendering Node",
        "Unlimited API Access",
        "Custom Supabase Integrations",
        "Zero-Latency Priority Queue",
        "Dedicated Account Slack Channel",
        "Advanced Analytics & Auditing",
        "Up to 10 Team Seats included"
      ],
      missing: [],
      buttonText: "Deploy Agency Hub",
      isPopular: false,
    },
    {
      id: "enterprise",
      name: "Zenith Enterprise",
      badge: "Large Scale Ops",
      icon: <Building2 className="w-5 h-5 text-amber-400" />,
      accent: "amber",
      price: 19999, // INR
      bestFor: "Corporations requiring dedicated infrastructure and maximum security.",
      features: [
        "Isolated Neural Network Instance",
        "Custom LLM Fine-Tuning",
        "On-Premise Deployment Options",
        "99.99% Uptime SLA Guarantee",
        "Unlimited Team Seats",
        "SSO & Advanced IAM Roles",
        "Dedicated Data Privacy Vault",
        "24/7 Phone & Email Support",
        "Dedicated Solutions Engineer",
        "Custom Feature Development",
        "Unlimited Storage Capacity"
      ],
      missing: [],
      buttonText: "Contact Enterprise",
      isPopular: false,
    }
  ];

  const addOns = [
    {
      name: "Dedicated H100 GPU Node",
      price: "₹4,999/mo",
      desc: "Attach dedicated compute power for instant cinematic rendering and massive data analysis.",
      icon: <Cpu className="w-5 h-5 text-purple-400" />
    },
    {
      name: "White-Label Portal",
      price: "₹1,999/mo",
      desc: "Remove 5onam branding and present the agent interface as your own agency's custom tool.",
      icon: <Globe className="w-5 h-5 text-blue-400" />
    },
    {
      name: "1TB Secure Storage",
      price: "₹999/mo",
      desc: "Expand your project memory vault to store massive codebases, 4K videos, and raw assets.",
      icon: <HardDrive className="w-5 h-5 text-emerald-400" />
    }
  ];

  const handlePurchase = async (plan: any) => {
    // 1. Authentication Check
    if (!user) {
      alert("Please login to make a purchase!");
      router.push("/login");
      return;
    }

    if (plan.price === 0 || plan.id === "enterprise") {
      router.push("/mainpage");
      return;
    }

    // 2. Load Razorpay
    setProcessingPlan(plan.id);
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load. Please check your connection.");
      setProcessingPlan(null);
      return;
    }

    // 3. Setup Razorpay Options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY", 
      amount: plan.price * 100, // amount in paisa
      currency: "INR",
      name: "Zen-Tech Intelligence",
      description: `5onam AI - ${plan.name} Plan`,
      image: "https://www.image2url.com/r2/default/images/1776349470511-ca803856-3d27-4d2b-bc06-2e3ce2001fe1.png",
      handler: function (response: any) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        setProcessingPlan(null);
        router.push("/mainpage"); 
      },
      prefill: {
        email: user.email || "",
      },
      theme: {
        color: "#9333ea",
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();

    paymentObject.on("payment.failed", function () {
      alert("Payment failed. Please try again.");
      setProcessingPlan(null);
    });
  };

  return (
    <main className="min-h-screen w-full relative flex flex-col font-sans text-white selection:bg-purple-500/30 bg-[#030305] overflow-x-hidden">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_60%)] pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay pointer-events-none" />

      {/* --- NAVIGATION --- */}
      <nav className="relative z-50 w-full px-6 md:px-12 py-6 flex items-center justify-between border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <img
            src="https://www.image2url.com/r2/default/images/1776349470511-ca803856-3d27-4d2b-bc06-2e3ce2001fe1.png"
            alt="5onam AI Logo"
            className="h-7 w-auto object-contain brightness-0 invert drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          />
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-white/60 hover:text-white transition-colors">Platform</Link>
          {!isLoadingAuth && !user ? (
            <Link href="/login" className="text-white/60 hover:text-white transition-colors">Sign In</Link>
          ) : (
            <Link href="/mainpage" className="text-white/60 hover:text-white transition-colors">Dashboard</Link>
          )}
          <Link 
            href={user ? "/mainpage" : "/signup"} 
            className="bg-white text-black px-6 py-2.5 rounded-full hover:bg-gray-200 transition-all active:scale-95 font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {user ? "Enter App" : "Start Free"}
          </Link>
        </div>

        <button className="md:hidden text-white p-2 hover:text-purple-200 transition-colors">
          <Menu size={24} />
        </button>
      </nav>

      {/* --- HEADER --- */}
      <section className="relative z-10 w-full pt-20 pb-16 px-4 flex flex-col items-center text-center">
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white mb-6 leading-tight">
          <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Scaled to your needs.</span>
        </h1>
       
      </section>

      {/* --- PREMIUM PRICING GRID (Horizontal Scroll on Mobile, Flex Wrap on Desktop) --- */}
      <section className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-8 pb-24">
        <div className="flex flex-col xl:flex-row flex-wrap justify-center gap-6">
          
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative flex flex-col p-8 rounded-[2.5rem] transition-all duration-500 bg-[#0a0a0f]/80 backdrop-blur-xl flex-1 min-w-[300px] max-w-[400px]
                ${plan.isPopular 
                  ? "border border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.2)] xl:-translate-y-4" 
                  : "border border-white/5 hover:border-white/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]"
                }
              `}
            >
              {/* Top Accent Line */}
              <div className={`absolute top-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-${plan.accent}-400 to-transparent opacity-50`} />

              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest px-5 py-1.5 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.6)]">
                  Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border bg-white/5 border-white/10 shadow-inner`}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{plan.name}</h3>
                    <p className={`text-[10px] font-bold tracking-widest uppercase mt-1 text-${plan.accent}-400`}>
                      {plan.badge}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-4 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-white tracking-tighter">
                  {plan.price === 0 ? "Free" : `₹${plan.price}`}
                </span>
                {plan.price > 0 && <span className="text-gray-500 font-medium">/mo</span>}
              </div>
              <p className="text-xs text-gray-400 mb-8 min-h-[40px] leading-relaxed border-b border-white/5 pb-6">
                {plan.bestFor}
              </p>

              {/* Features List (10+ Items) */}
              <div className="flex flex-col gap-4 flex-1 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 text-${plan.accent}-400`} />
                    <span className="text-[13px] text-gray-300 leading-snug font-medium">{feature}</span>
                  </div>
                ))}
                
                {plan.missing.map((feature, idx) => (
                  <div key={`missing-${idx}`} className="flex items-start gap-3 opacity-30">
                    <X className="w-4 h-4 shrink-0 mt-0.5 text-gray-500" />
                    <span className="text-[13px] text-gray-500 leading-snug line-through">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => handlePurchase(plan)}
                disabled={processingPlan === plan.id}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all
                  ${plan.isPopular 
                    ? "bg-white text-black hover:bg-gray-200 shadow-[0_0_30px_rgba(255,255,255,0.3)]" 
                    : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                  }
                  ${processingPlan === plan.id ? "opacity-70 cursor-not-allowed" : "active:scale-95"}
                `}
              >
                {processingPlan === plan.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {plan.buttonText}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ))}

        </div>
      </section>

      {/* --- MODULAR ADD-ONS BENTO --- */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8 pb-32">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
              Modular Add-Ons.
            </h2>
            <p className="text-gray-400 text-sm">Scale specific parts of your infrastructure seamlessly.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {addOns.map((addon, idx) => (
            <div key={idx} className="bg-[#0a0a0f]/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 hover:border-white/20 transition-all flex flex-col justify-between group shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {addon.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{addon.name}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">{addon.desc}</p>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-6">
                <span className="text-xl font-extrabold text-white">{addon.price}</span>
                <button 
                  onClick={() => {
                    if(!user) {
                      alert("Please login to add modules!"); 
                      router.push("/login");
                    } else {
                      alert("Module expansion requested. Redirecting to billing setup.");
                    }
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECURE BANNER & FOOTER --- */}
      <div className="relative z-10 w-full border-t border-white/5 bg-[#020203]">
        <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-gray-500 text-xs font-medium bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted Checkout via <b>Razorpay</b>. Cancel anytime.</span>
          </div>
          <p className="text-[11px] font-bold text-gray-600 tracking-widest uppercase">
            5ONAM AI &copy; AN AGENT OF Zen-Tech Intelligence Wing!
          </p>
        </div>
      </div>

    </main>
  );
}