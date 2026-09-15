"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Inter_Tight } from "next/font/google";
import { createClient } from "../../utils/supabase/client";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [mobileMessage, setMobileMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [isMobileLoading, setIsMobileLoading] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(1);

  const router = useRouter();
  const supabase = createClient();

  // Mobile OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMobileLoading(true);
    setMobileMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      phone: `+91${mobile}`,
    });

    if (error) {
      setMobileMessage({
        type: "error",
        text: error.message,
      });
    } else {
      setMobileMessage({
        type: "success",
        text: "OTP sent successfully!",
      });
      setIsOtpSent(true);
    }

    setIsMobileLoading(false);
  };

  // Verify Mobile OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMobileLoading(true);
    setMobileMessage(null);

    const { error } = await supabase.auth.verifyOtp({
      phone: `+91${mobile}`,
      token: otp,
      type: "sms",
    });

    if (error) {
      setMobileMessage({
        type: "error",
        text: error.message,
      });
      setIsMobileLoading(false);
    } else {
      setMobileMessage({
        type: "success",
        text: "Verified successfully!",
      });
      router.push("/dashboard");
    }
  };

  // Email Sign Up / Sign In
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (isSignUp) {
      if (!isEmailOtpSent) {
        const { error } = await supabase.auth.signInWithOtp({ email });

        if (error) {
          setMessage({
            type: "error",
            text: "Error sending verification OTP",
          });
        } else {
          setMessage({
            type: "success",
            text: "OTP sent to your email.",
          });
          setIsEmailOtpSent(true);
        }
      } else {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: emailOtp,
          type: "email",
        });

        if (error) {
          setMessage({
            type: "error",
            text: error.message,
          });
        } else {
          setMessage({
            type: "success",
            text: "Verified successfully!",
          });
          router.push("/set-password");
        }
      }

      setIsLoading(false);
      return;
    }

    // Normal Email + Password Sign In
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage({
        type: "error",
        text: error.message,
      });
      setIsLoading(false);
    } else {
      setMessage({
        type: "success",
        text: "Successfully signed in!",
      });
      router.push("/dashboard");
    }
  };

  // Google Sign In
  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard",
      },
    });
  };

  return (
    <main
      className={`${interTight.className} min-h-screen bg-[#FFFFFF] px-6 py-8 text-[#121212] sm:px-10 sm:py-10 lg:px-14 lg:py-10`}
    >
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[1500px] flex-col">
        {/* Top amber structural line */}
        <div className="h-[2px] w-full bg-[#FFBF1B]" />

        {/* Header */}
        <header className="flex items-center justify-between pt-6">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5B5B5B]">
            FOXSCAN
          </span>

          <div className="hidden items-center gap-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8A8A8A] sm:flex">
            <span>INSPECT</span>
            <span className="text-[#FFBF1B]">✱</span>
            <span>ANALYZE</span>
            <span className="text-[#FFBF1B]">✱</span>
            <span>PROTECT</span>
          </div>
        </header>

        {/* Authentication content */}
        <section className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            <div className="rounded-[4px] border border-[#D9D9D9] bg-white p-8 shadow-[0_12px_40px_rgba(18,18,18,0.06)] sm:p-10">

              {/* FOXSCAN Logo */}
              <div className="mb-8 flex flex-col items-center">
                <img
                  src="/foxscan-mark.svg"
                  alt="FOXSCAN logo"
                  className="h-[80px] w-auto object-contain"
                />

                <div className="mt-3 text-[25px] font-medium uppercase leading-none tracking-[-0.02em] text-[#121212]">
                  FOXSCAN
                </div>

                <div className="mt-4 h-[2px] w-14 bg-[#FFBF1B]" />
              </div>

              {/* Heading */}
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-medium tracking-[-0.02em] text-[#121212]">
                  {currentSlide === 1
                    ? "Welcome back"
                    : isSignUp
                      ? "Create an account"
                      : "Welcome back"}
                </h1>

                <p className="mt-2 text-sm font-normal leading-6 text-[#5B5B5B]">
                  {currentSlide === 1
                    ? "Sign in with your mobile number"
                    : isSignUp
                      ? "Enter your email to create your account"
                      : "Enter your credentials to access your account"}
                </p>
              </div>

              {/* ====================================================== */}
              {/* MOBILE OTP */}
              {/* ====================================================== */}

              {currentSlide === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <form
                    className="space-y-5"
                    onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp}
                  >
                    {/* Message */}
                    {mobileMessage && (
                      <div
                        className={`border p-3 text-sm font-medium ${mobileMessage.type === "error"
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-green-200 bg-green-50 text-green-700"
                          }`}
                      >
                        {mobileMessage.text}
                      </div>
                    )}

                    {!isOtpSent ? (
                      <div className="space-y-2">
                        <label
                          htmlFor="mobile"
                          className="block text-[12px] font-medium uppercase tracking-[0.12em] text-[#121212]"
                        >
                          Mobile number
                        </label>

                        <div className="flex gap-2">
                          <div className="flex min-w-[72px] items-center justify-center border border-[#8A8A8A] bg-white px-4 py-3 text-sm font-medium text-[#121212]">
                            +91
                          </div>

                          <input
                            id="mobile"
                            type="tel"
                            placeholder="98765 43210"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            className="min-w-0 flex-1 border border-[#8A8A8A] bg-white px-4 py-3 text-sm text-[#121212] outline-none placeholder:text-[#8A8A8A] focus:border-[#FFBF1B] focus:ring-1 focus:ring-[#FFBF1B]"
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label
                          htmlFor="otp"
                          className="block text-[12px] font-medium uppercase tracking-[0.12em] text-[#121212]"
                        >
                          One-Time Password
                        </label>

                        <input
                          id="otp"
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full border border-[#8A8A8A] bg-white px-4 py-3 text-sm text-[#121212] outline-none placeholder:text-[#8A8A8A] focus:border-[#FFBF1B] focus:ring-1 focus:ring-[#FFBF1B]"
                          required
                        />
                      </div>
                    )}

                    {/* Send / Verify OTP */}
                    <button
                      type="submit"
                      disabled={isMobileLoading}
                      className="w-full border border-[#121212] bg-[#121212] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[#262626] focus:outline-none focus:ring-2 focus:ring-[#FFBF1B] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isMobileLoading
                        ? isOtpSent
                          ? "Verifying..."
                          : "Sending..."
                        : isOtpSent
                          ? "Verify OTP"
                          : "Send OTP"}
                    </button>
                  </form>

                  {/* Mobile → Email */}
                  <button
                    type="button"
                    onClick={() => setCurrentSlide(2)}
                    className="mt-5 w-full border border-[#8A8A8A] bg-white px-4 py-3 text-[11px] font-medium uppercase tracking-[0.12em] text-[#121212] transition-colors duration-300 hover:border-[#121212] hover:bg-[#F7F7F7] focus:outline-none focus:ring-2 focus:ring-[#FFBF1B]"
                  >
                    Next (Email Sign-In)
                  </button>

                  {/* NOTE:
                      Google authentication is intentionally NOT shown
                      on the Mobile OTP screen.
                  */}
                </div>
              )}

              {/* ====================================================== */}
              {/* EMAIL AUTHENTICATION */}
              {/* ====================================================== */}

              {currentSlide === 2 && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                  <form className="space-y-5" onSubmit={handleEmailAuth}>
                    {/* Message */}
                    {message && (
                      <div
                        className={`border p-3 text-sm font-medium ${message.type === "error"
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-green-200 bg-green-50 text-green-700"
                          }`}
                      >
                        {message.text}
                      </div>
                    )}

                    {/* Email */}
                    {(!isSignUp || !isEmailOtpSent) && (
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="block text-[12px] font-medium uppercase tracking-[0.12em] text-[#121212]"
                        >
                          Email address
                        </label>

                        <input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full border border-[#8A8A8A] bg-white px-4 py-3 text-sm text-[#121212] outline-none placeholder:text-[#8A8A8A] focus:border-[#FFBF1B] focus:ring-1 focus:ring-[#FFBF1B]"
                          required
                        />
                      </div>
                    )}

                    {/* Email OTP for Sign Up */}
                    {isSignUp && isEmailOtpSent && (
                      <div className="space-y-2">
                        <label
                          htmlFor="emailOtp"
                          className="block text-[12px] font-medium uppercase tracking-[0.12em] text-[#121212]"
                        >
                          One-Time Password
                        </label>

                        <input
                          id="emailOtp"
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={emailOtp}
                          onChange={(e) => setEmailOtp(e.target.value)}
                          className="w-full border border-[#8A8A8A] bg-white px-4 py-3 text-sm text-[#121212] outline-none placeholder:text-[#8A8A8A] focus:border-[#FFBF1B] focus:ring-1 focus:ring-[#FFBF1B]"
                          required
                        />
                      </div>
                    )}

                    {/* Password */}
                    {!isSignUp && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="password"
                            className="text-[12px] font-medium uppercase tracking-[0.12em] text-[#121212]"
                          >
                            Password
                          </label>

                          <Link
                            href="#"
                            className="text-xs font-medium text-[#FFBF1B] transition-colors hover:text-[#121212]"
                          >
                            Forgot?
                          </Link>
                        </div>

                        <input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full border border-[#8A8A8A] bg-white px-4 py-3 text-sm text-[#121212] outline-none placeholder:text-[#8A8A8A] focus:border-[#FFBF1B] focus:ring-1 focus:ring-[#FFBF1B]"
                          required
                        />
                      </div>
                    )}

                    {/* Email Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full border border-[#121212] bg-[#121212] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[#262626] focus:outline-none focus:ring-2 focus:ring-[#FFBF1B] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoading
                        ? isSignUp
                          ? isEmailOtpSent
                            ? "Verifying..."
                            : "Sending..."
                          : "Signing in..."
                        : isSignUp
                          ? isEmailOtpSent
                            ? "Verify OTP"
                            : "Sign Up"
                          : "Sign In"}
                    </button>
                  </form>

                  {/* Google — EMAIL AUTH ONLY */}
                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[#D9D9D9]" />

                    <span className="px-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#8A8A8A]">
                      Or continue with
                    </span>

                    <div className="h-px flex-1 bg-[#D9D9D9]" />
                  </div>

                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="flex w-full items-center justify-center gap-3 border border-[#8A8A8A] bg-white px-4 py-3 text-sm font-medium text-[#121212] transition-colors duration-300 hover:border-[#121212] hover:bg-[#F7F7F7] focus:outline-none focus:ring-2 focus:ring-[#FFBF1B]"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77-3.71 1.06c-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>

                      Google
                    </button>
                  </div>

                  {/* Sign Up / Sign In */}
                  <p className="mt-6 text-center text-sm text-[#5B5B5B]">
                    {isSignUp
                      ? "Already have an account?"
                      : "Don't have an account?"}{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setMessage(null);
                        setIsEmailOtpSent(false);
                        setEmailOtp("");
                      }}
                      className="font-medium text-[#FFBF1B] transition-colors hover:text-[#121212] hover:underline"
                    >
                      {isSignUp ? "Sign in" : "Sign up"}
                    </button>
                  </p>

                  {/* Back to Mobile OTP */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentSlide(1);
                      setIsEmailOtpSent(false);
                      setEmailOtp("");
                      setMessage(null);
                    }}
                    className="mt-5 w-full border border-[#8A8A8A] bg-white px-4 py-3 text-[11px] font-medium uppercase tracking-[0.12em] text-[#121212] transition-colors duration-300 hover:border-[#121212] hover:bg-[#F7F7F7] focus:outline-none focus:ring-2 focus:ring-[#FFBF1B]"
                  >
                    Back to Mobile OTP
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Bottom amber structural line */}
        <div className="h-[2px] w-full bg-[#FFBF1B]" />

        {/* Footer */}
        <footer className="flex items-center justify-between pt-5">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8A8A8A]">
            STRUCTURAL DIAGNOSTICS
          </span>

          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8A8A8A]">
            FOXSCAN
            <span className="mx-2 text-[#FFBF1B]">✱</span>
            2026
          </span>
        </footer>
      </div>
    </main>
  );
}