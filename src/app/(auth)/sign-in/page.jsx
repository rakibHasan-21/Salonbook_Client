
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Scissors,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Email and Password Sign In
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      // Get logged-in user session
      const { data: sessionData, error: sessionError } =
        await authClient.getSession();

      if (sessionError || !sessionData?.user) {
        toast.error("Unable to get user information.");
        return;
      }

      const role = sessionData.user.role;

      toast.success("Login successful!");

      const callbackURL = new URLSearchParams(window.location.search).get(
        "callbackURL"
      );

      const safeCallbackURL =
        callbackURL &&
        callbackURL.startsWith("/") &&
        !callbackURL.startsWith("//")
          ? callbackURL
          : null;

      const normalizedCallbackURL =
        safeCallbackURL === "/dashboard"
          ? "/dashboard/customer"
          : safeCallbackURL === "/admin"
            ? "/dashboard/admin"
            : safeCallbackURL;

      const target =
        normalizedCallbackURL ||
        (role === "admin" ? "/dashboard/admin" : "/dashboard/customer");

      router.replace(target);
      router.refresh();

    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google Sign In
  const handleGoogleSignIn = async () => {
    if (googleLoading || loading) return;

    try {
      setGoogleLoading(true);

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Google sign in failed.");
        setGoogleLoading(false);
      }

    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Unable to sign in with Google.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffaf9]">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">

        {/* Left Side - Form */}
        <section className="flex items-center justify-center px-6 py-16 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">

            {/* Logo */}
            <Link href="/" className="mb-12 inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white">
                <Scissors size={22} />
              </div>

              <span className="text-2xl font-bold tracking-tight text-gray-900">
                Salon<span className="text-rose-500">Book</span>
              </span>
            </Link>

            {/* Heading */}
            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
                Welcome Back
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Sign in to your account
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Welcome back! Please enter your details to access your
                SalonBook account.
              </p>
            </div>

            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              disabled={googleLoading || loading}
              onClick={handleGoogleSignIn}
              className="h-12 w-full rounded-xl border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <span className="mr-2 text-lg font-bold text-blue-600">G</span>
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </Button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />

              <span className="text-xs font-medium text-gray-400">
                OR CONTINUE WITH EMAIL
              </span>

              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400"
                  />

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="h-12 rounded-xl border-gray-200 bg-white pl-11 text-sm focus-visible:border-rose-400 focus-visible:ring-rose-100"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-rose-500 transition hover:text-rose-600"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400"
                  />

                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="h-12 rounded-xl border-gray-200 bg-white pl-11 pr-12 text-sm focus-visible:border-rose-400 focus-visible:ring-rose-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="border-gray-300 data-[state=checked]:border-rose-500 data-[state=checked]:bg-rose-500"
                />

                <label
                  htmlFor="rememberMe"
                  className="cursor-pointer text-sm text-gray-500"
                >
                  Remember me
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || googleLoading}
                className="h-12 w-full rounded-xl bg-rose-500 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600 active:scale-[0.98]"
              >
                {loading ? "Signing In..." : "Sign In"}
                {!loading && <ArrowRight size={18} />}
              </Button>
            </form>

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-bold text-rose-500 transition hover:text-rose-600"
              >
                Create an account
              </Link>
            </p>

            {/* Copyright */}
            <p className="mt-10 text-center text-xs text-gray-400">
              © {new Date().getFullYear()} SalonBook. All rights reserved.
            </p>
          </div>
        </section>

        {/* Right Side - Image */}
        <section className="relative hidden overflow-hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=85&w=1200"
            alt="Beautiful modern salon interior"
            fill
            priority
            unoptimized
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

          <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
            <div className="mb-5 inline-flex rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-medium backdrop-blur-md">
              Your Beauty, Your Schedule
            </div>

            <h2 className="max-w-lg text-4xl font-bold leading-tight">
              A little self-care goes a long way.
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-white/80">
              Discover your favorite salon, book your appointment, and make
              time for yourself. Your next beauty experience starts here.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
