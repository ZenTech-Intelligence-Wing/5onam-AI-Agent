"use client";
import { supabase } from "@/src/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // --- AUTHENTICATION LOGIC ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setIsLoading(false);
      return;
    }

    // Force Next.js to update server components with the new cookie before redirecting
    router.refresh();
    router.push("/chat");
  };
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // This is the critical line. It must go to /auth/callback
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(error.message);
      setIsLoading(false);
    }
  };
  const handleFacebookLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(error.message);
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-white font-sans flex-col lg:flex-row overflow-hidden">
      {/* Left Side: 70% Flexible Full-Screen Video Background */}
      <div className="hidden lg:flex lg:w-[70%] relative min-h-screen bg-black overflow-hidden flex-col justify-end p-10 border-r border-gray-200">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <iframe
            src="https://player.vimeo.com/video/1172426268?background=1&autoplay=1&loop=1&muted=1&autopause=0"
            className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-w-[177.77vh] min-h-screen -translate-x-1/2 -translate-y-1/2"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
          ></iframe>
        </div>

        <div className="relative z-20 text-xs font-semibold text-white/90 drop-shadow-md">
          &copy; {new Date().getFullYear()} Zen-Tech Intelligence Wing. All
          rights reserved.
        </div>
      </div>

      {/* Right Side: 30% Flexible Form Section */}
      <div className="w-full lg:w-[30%] lg:min-w-[420px] flex flex-col justify-center p-8 sm:p-12 bg-white relative z-10 min-h-screen">
        <div className="relative h-48 w-full overflow-hidden lg:hidden bg-black rounded-xl shadow-inner mb-8 pointer-events-none">
          <iframe
            src="https://player.vimeo.com/video/1172426268?background=1&autoplay=1&loop=1&muted=1&autopause=0"
            className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
          ></iframe>
        </div>

        <div className="w-full flex flex-col animate-in fade-in duration-500">
          <div className="mb-10 flex justify-center">
            <img
              src="https://www.image2url.com/r2/default/images/1776349590881-7c3f54c2-fed1-4d1c-83f2-1c3ae1fd79a7.png"
              alt="5onam AI Logo"
              className="h-16 w-auto object-contain drop-shadow-md"
            />
          </div>

          <form onSubmit={handleLogin} className="w-full">
            <div className="space-y-5">
              <div className="w-full flex flex-col">
                <label className="text-xs font-semibold text-gray-600 mb-2">
                  Work Email / Username
                </label>
                <div className="relative flex items-center w-full">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    disabled={isLoading}
                    className="w-full h-11 px-4 bg-[#EFF4F9] rounded-md text-gray-900 text-sm outline-none transition-all duration-200 focus:bg-[#E5EAF1] disabled:opacity-50 border-none focus:ring-0"
                  />
                </div>
              </div>

              <div className="w-full flex flex-col">
                <label className="text-xs font-semibold text-gray-600 mb-2">
                  Password
                </label>
                <div className="relative flex items-center w-full">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="w-full h-11 px-4 pr-10 bg-[#EFF4F9] rounded-md text-gray-900 text-sm outline-none transition-all duration-200 focus:bg-[#E5EAF1] disabled:opacity-50 border-none focus:ring-0"
                  />
                  <Eye
                    size={18}
                    className="absolute right-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center mt-4 mb-8">
              <input
                type="checkbox"
                id="remember"
                className="w-3.5 h-3.5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="ml-2 text-xs text-gray-600 cursor-pointer select-none font-medium"
              >
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-md bg-[#2585EB] text-white font-medium text-sm hover:bg-[#1E74D4] transition-colors duration-200 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 pt-6 flex flex-col gap-3 w-full">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-11 rounded-md bg-white border border-gray-200 text-gray-600 flex items-center justify-center gap-3 text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              <FcGoogle size={18} /> Sign in with Google
            </button>

            <button
              onClick={handleFacebookLogin}
              disabled={isLoading}
              className="w-full h-11 rounded-md bg-white border border-gray-200 text-gray-600 flex items-center justify-center gap-3 text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              <FaFacebookF size={16} className="text-[#1877F2]" /> Sign in with
              Facebook
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600 font-medium">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-[#2585EB] hover:underline underline-offset-2"
            >
              Sign up
            </Link>
          </div>

          <div className="mt-8 text-center text-[11px] text-gray-500 font-medium">
            By signing in, you agree to our{" "}
            <Link
              href="/terms"
              className="text-[#2585EB] hover:underline underline-offset-2"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-[#2585EB] hover:underline underline-offset-2"
            >
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>
    </main>
  );
}
