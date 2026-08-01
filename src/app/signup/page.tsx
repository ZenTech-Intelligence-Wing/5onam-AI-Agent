"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import logo from "../imgg/5onamAi-logo.png";
import robot from "../imgg/robotimg.png";

import { Eye } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebookF } from "react-icons/fa";

export default function SignupPage() {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();  
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#b06e57] via-[#a56c71] to-[#8a5c6f] flex items-center justify-center p-4">
      <div className="w-full max-w-7xl bg-white rounded-[30px] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2">

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
              Welcome to <br /> Sonam AI
            </h2>

            <p className="mt-2 text-sm">
              Intelligent AI Assistant
            </p>
          </div>
        </div>

        {/* Left Side */}
        <div className="flex items-center justify-center px-8 py-10">
          <div className="w-full max-w-md">

            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Image
                src={logo}
                alt="Sonam AI"
                width={220}
                height={80}
                priority
              />
            </div>

            <h1 className="text-5xl font-bold text-center">
              Create Account
            </h1>

            <p className="text-center text-gray-500 mt-3 mb-8">
              Create your Sonam AI account
            </p>

            {/* Name */}
            <input
              type="text"
              placeholder="Full Name"
              className="w-full h-14 rounded-xl border bg-gray-100 px-5 mb-4 outline-none"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email Address"
              className="w-full h-14 rounded-xl border bg-gray-100 px-5 mb-4 outline-none"
            />

            {/* Password */}
            <div className="relative mb-4">
              <input
                type="password"
                placeholder="Password"
                className="w-full h-14 rounded-xl border bg-gray-100 px-5 outline-none"
              />

              <Eye
                size={20}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full h-14 rounded-xl border bg-gray-100 px-5 outline-none"
              />

              <Eye
                size={20}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 mt-5">
              <input
                type="checkbox"
                id="terms"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1"
              />

              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-[#9f6d79] font-medium hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-[#9f6d79] font-medium hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            {/* Button */}
            <button onClick={() => router.push("/mainpage")}
              disabled={!accepted}
              className={`w-full h-14 rounded-xl text-white font-semibold mt-8 transition ${
                accepted
                  ? "bg-[#9f6d79] hover:bg-[#8d5b69]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Create Account
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gray-300"></div>

              <span className="text-sm text-gray-500">
                Or continue with
              </span>

              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Social Login */}
            <div className="flex justify-center gap-5">
              <button className="w-14 h-14 rounded-xl border shadow flex items-center justify-center">
                <FcGoogle size={28} />
              </button>

              <button className="w-14 h-14 rounded-xl border shadow flex items-center justify-center">
                <FaApple size={28} />
              </button>

              <button className="w-14 h-14 rounded-xl border shadow flex items-center justify-center">
                <FaFacebookF
                  className="text-blue-600"
                  size={24}
                />
              </button>
            </div>

            <p className="text-center text-sm mt-6">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#9f6d79] font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>

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
            <h2 className="text-5xl font-bold">
              Welcome to
              <br />
              Sonam AI
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