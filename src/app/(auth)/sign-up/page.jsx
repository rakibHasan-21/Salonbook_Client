
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Scissors, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmited = async (e) => {
    e.preventDefault();

    if (loading) return;

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();
    const image = formData.get("image")?.toString().trim();

    // Required field validation
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (name.length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }

    if (name.length > 80) {
      toast.error("Name cannot exceed 80 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (image) {
      try {
        const url = new URL(image);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        toast.error("Profile image must be a valid http or https URL.");
        return;
      }
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must contain at least 6 characters, one uppercase and one lowercase letter."
      );
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: image || undefined,
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      toast.success("Account created successfully!");

      console.log("Signup successful:", data);

      // Clear form after successful signup
      e.target.reset();
      router.push("/");

    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf9f7] px-4 py-10">
      <div className="mx-auto grid min-h-[650px] max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">

        {/* Left Side - Form */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-md">

            {/* Logo */}
            <Link href="/" className="mb-10 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white">
                <Scissors size={22} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-gray-900">
                Salon<span className="text-rose-600">Book</span>
              </span>
            </Link>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Join SalonBook and book your next beauty experience.
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmited} className="space-y-5">

              {/* Name */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                  className="h-12"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  className="h-12"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label
                  htmlFor="image"
                  className="text-sm font-medium text-gray-700"
                >
                  Profile Image URL
                  <span className="ml-1 text-gray-400">(Optional)</span>
                </label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="h-12"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="h-12 pr-12"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-rose-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-400">
                  Minimum 6 characters, including uppercase and lowercase letters.
                </p>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full bg-rose-600 text-base font-semibold text-white hover:bg-rose-700"
              >
                {loading ? "Creating Account..." : "Create Account"}
                {!loading && <ArrowRight className="ml-2" size={18} />}
              </Button>
            </form>

            {/* Sign In Link */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-semibold text-rose-600 hover:underline"
              >
                Sign In
              </Link>
            </p>

          </div>
        </div>

        {/* Right Side - Image */}
        <div className="relative hidden min-h-[650px] md:block">
          <Image
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200"
            alt="Beautiful modern salon interior"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

          <div className="absolute bottom-12 left-10 right-10 text-white">
            <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur-md">
              Your Beauty, Your Schedule
            </span>

            <h2 className="text-4xl font-bold leading-tight">
              Beauty begins with a little self-care.
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-white/80">
              Discover trusted salon services, choose your favorite treatment,
              and book your appointment with ease.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
};

export default SignUpPage;
