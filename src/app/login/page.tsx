"use client";
import { supabase } from "@/src/utils/supabase/client";
import Image from "next/image";
import {useState} from "react"
import logo from "../imgg/5onamAi-logo.png";
import robot from "../imgg/robotimg.png";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebookF } from "react-icons/fa";
import Link from "next/link";
export default function LoginPage() {
  const [email ,setEmail] = useState("");
  const [password , setPassword] = useState("");
  const router = useRouter();
  const handleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
    return;
  }

  router.push("/mainpage");
};
 
  
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-r from-purple-900 via-pink-900 to-indigo-900 animate-bg flex items-center justify-center p-4">

      <div className="absolute top-10 left-10 w-80 h-80 bg-purple-500 rounded-full blur-[80px] opacity-60 animate-float"></div>

     <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-500 rounded-full blur-[80px] opacity-60 animate-float " ></div>
      <div className="w-full max-w-7xl bg-white/10 backdrop-blur-xl rounded-[30px] overflow-hidden border border-white/20 grid grid-cols-1 lg:grid-cols-2 shadow-[0_20px_60px_rgba(0,0,0,0.35)] hover:shadow-[0_35px_90px_rgba(0,0,0,0.45),0_0_60px_rgba(139,92,246,0.35),0_0_100px_rgba(59,130,246,0.25)] hover:-translate-y-2 hover:scale-[1.01] transition-all duration-500 ease-out">

        {/* Mobile Image */}
        <div className="relative h-72 lg:hidden">
          <Image
            src={robot}
            alt="Robot"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-3xl font-bold">
              Welcome to <br /> 5onam AI
            </h2>
            <p className="mt-2 text-sm">
              Intelligent AI Assistant
            </p>
          </div>
        </div>

        {/* Left Side */}
        <div className="flex items-center justify-center px-8 py-10  bg-gradiend-to-br from-[#6d2d91]/80 via-[#4b3fa81]/80 backdrop-blur-x1 border-r border-white/20">
          <div className="w-full max-w-md">

            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Image
                src={logo}
                alt="Sonam AI"
                width={380}
                height={90}
                priority
                 className=" mx-auto mb-2   hover:scale-105 transition-all duration-30"
              />
            </div>

            <h1 className="text-5xl lg:text-6x1 font -extraibold tracking-tight text-center text-slate-900">
              Welcome Back
            </h1>

            <p className="text-center text-black-500 text-lg mt-3 mb-10">
              Sign in to continue to Sonam AI
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full h-14 rounded-xl bg-white/10 border border-white/800 px-5 mb-5 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
            />

            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full h-14 rounded-xl bg-white/10 border border-white/800 px-5 mb-1 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400 transition-all"               />

              <Eye
                size={20}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 cursor-pointer"
              />
            </div>

            <div className="text-right font-bold mt-5">
              <button className="text-10sm text-black/80 text-bold hover:text-cyan-300">
                Forgot Password?
              </button>
            </div>

            <button onClick={handleLogin} className="group relative w-full h-14 mt-20 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-black-600 to-fuchsia-600 text-black font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(128,85,247,0.6)] active:scale-95">

         <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/60 to-transparent group-hover:translate-x-full transition-transform duration-1000"></span>

         <span className="relative z-20  text-black/100 font-bold  ">
             Login 
         </span>

</button>


<p className="text-center mt-5 text-black font-medium">
  Don't have an account?{" "}
  <Link
    href="/signup"
    className="text-cyan-400 hover:text-cyan-300 underline"
  >
    Create a new account
  </Link>
</p>

<div className="flex items-center gap-4 my-8"></div>

            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-white/70"></div>
              <span className="text-60sm text-white/70">
                Or continue with
              </span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <div className="flex justify-center gap-5">
              <button className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 hover:bg-white/90 transition-all duration-300 flex items-center justify-center">
                <FcGoogle size={28} />
              </button>

              <button className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 hover:bg-white/90 transition-all duration-300 flex items-center justify-center">
                <FaApple size={28} />
              </button>

              <button className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 hover:bg-white/90 transition-all duration-300 flex items-center justify-center">
                <FaFacebookF className="text-blue-600" size={24} />
              </button>
            </div>

          </div>
          
        </div>

        {/* Desktop Image */}
        <div className="relative hidden lg:block">
          <Image
            src={robot}
            alt="Robot"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute bottom-10 left-10 text-white">
            <h2 className="text-5xl font-bold ">
              Welcome to
              <br />
              5onam AI
            </h2>

            <p className="mt-4 text-lg">
              Intelligent AI Assistant
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}