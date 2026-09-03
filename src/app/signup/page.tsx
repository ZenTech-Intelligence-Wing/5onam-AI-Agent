"use client";
import { supabase } from "@/src/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import Link from "next/link";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // --- AUTHENTICATION LOGIC ---
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        // UPDATED: Added this to handle email verification redirects
        emailredirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(error.message);
      setIsLoading(false);
      return;
    }

    // UPDATED: Now goes directly to chat instead of login
    router.push("/chat");
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
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

      <div className="w-full lg:w-[30%] lg:min-w-[420px] flex flex-col p-8 sm:p-12 bg-white relative z-10 min-h-screen overflow-y-auto">
        <div className="relative h-48 w-full shrink-0 overflow-hidden lg:hidden bg-black rounded-xl shadow-inner mb-8 pointer-events-none">
          <iframe
            src="https://player.vimeo.com/video/1172426268?background=1&autoplay=1&loop=1&muted=1&autopause=0"
            className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
          ></iframe>
        </div>

        <div className="w-full flex flex-col animate-in fade-in duration-500 my-auto">
          <div className="mb-8 flex justify-center">
            <img
              src="https://www.image2url.com/r2/default/images/1776349590881-7c3f54c2-fed1-4d1c-83f2-1c3ae1fd79a7.png"
              alt="5onam AI Logo"
              className="h-16 w-auto object-contain drop-shadow-md"
            />
          </div>

          <form onSubmit={handleSignup} className="w-full">
            <div className="space-y-4">
              <div className="w-full flex flex-col">
                <label className="text-xs font-semibold text-gray-600 mb-1.5">
                  Full Name
                </label>
                <div className="relative flex items-center w-full">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                    disabled={isLoading}
                    className="w-full h-11 px-4 bg-[#EFF4F9] rounded-md text-gray-900 text-sm outline-none transition-all duration-200 focus:bg-[#E5EAF1] disabled:opacity-50 border-none focus:ring-0"
                  />
                </div>
              </div>

              <div className="w-full flex flex-col">
                <label className="text-xs font-semibold text-gray-600 mb-1.5">
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
                <label className="text-xs font-semibold text-gray-600 mb-1.5">
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

              <div className="w-full flex flex-col">
                <label className="text-xs font-semibold text-gray-600 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative flex items-center w-full">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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

            <div className="flex items-start mt-5 mb-6">
              <input
                type="checkbox"
                id="terms"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="w-3.5 h-3.5 mt-0.5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer shrink-0"
              />
              <label
                htmlFor="terms"
                className="ml-2 text-[11px] text-gray-600 cursor-pointer font-medium leading-relaxed"
              >
                I agree to the{" "}
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
              </label>
            </div>

            <button
              type="submit"
              disabled={!accepted || isLoading}
              className={`w-full h-11 rounded-md text-white font-medium text-sm transition-colors duration-200 shadow-sm ${
                !accepted || isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#2585EB] hover:bg-[#1E74D4] active:scale-[0.99]"
              }`}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3 w-full">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-11 rounded-md bg-white border border-gray-200 text-gray-600 flex items-center justify-center gap-3 text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              <FcGoogle size={18} /> Sign up with Google
            </button>

            <button
              onClick={handleFacebookLogin}
              disabled={isLoading}
              className="w-full h-11 rounded-md bg-white border border-gray-200 text-gray-600 flex items-center justify-center gap-3 text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              <FaFacebookF size={16} className="text-[#1877F2]" /> Sign up with
              Facebook
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600 font-medium">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#2585EB] hover:underline underline-offset-2"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
