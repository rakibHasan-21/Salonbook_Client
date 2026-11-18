
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Star,
} from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-rose-50/40 to-pink-50/60">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-rose-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-pink-100/50 blur-3xl" />

      <div className="relative mx-auto grid max-w-5xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">

        {/* Left Content */}
        <div className="max-w-xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/80 px-4 py-2 shadow-sm">
            <Sparkles size={15} className="text-rose-500" />
            <span className="text-xs font-bold tracking-wide text-rose-600">
              YOUR BEAUTY, OUR PRIORITY
            </span>
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-gray-900 sm:text-5xl lg:text-[58px]">
            Your Beauty,
            <br />
            Your Style,
            <br />
            <span className="bg-gradient-to-r from-rose-500 to-pink-400 bg-clip-text text-transparent">
              Your Appointment.
            </span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-8 text-gray-500 sm:text-lg">
            Discover your perfect salon experience. Explore professional
            beauty services, choose your favorite treatments, and book
            appointments effortlessly with SalonBook.
          </p>

          {/* CTA */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/services"
              className="group inline-flex items-center gap-3 rounded-full bg-rose-500 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-rose-200/70 transition-all duration-300 hover:-translate-y-1 hover:bg-rose-600 hover:shadow-xl"
            >
              Explore Salon Services
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <CheckCircle2 size={18} className="text-rose-500" />
              Easy Online Booking
            </div>
          </div>

          {/* Bottom Features */}
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-rose-100 pt-7">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100/70 text-rose-500">
                <Star size={17} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">
                  Quality Services
                </p>
                <p className="text-xs text-gray-400">
                  Professional care
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100/70 text-rose-500">
                <Clock size={17} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">
                  Easy Booking
                </p>
                <p className="text-xs text-gray-400">
                  Anytime, anywhere
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative mx-auto w-full max-w-[540px] lg:ml-auto">
          {/* Image Background */}
          <div className="absolute -right-4 -top-4 h-full w-full rounded-[2rem] border border-rose-100 bg-rose-100/40 sm:-right-5 sm:-top-5" />

          <div className="relative overflow-hidden rounded-[2rem] bg-rose-100 shadow-2xl shadow-rose-200/50">
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1000&auto=format&fit=crop&q=85"
              alt="Beautiful modern salon interior"
              className="h-[380px] w-full object-cover sm:h-[480px] lg:h-[540px]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>

          {/* Rating Card */}
          <div className="absolute -left-3 top-10 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl backdrop-blur-xl sm:-left-10">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <Star size={22} fill="currentColor" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-gray-900">4.9/5</p>
              <p className="text-xs text-gray-500">Customer Experience</p>
            </div>
          </div>

          {/* Booking Card */}
          <div className="absolute -bottom-5 right-2 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl backdrop-blur-xl sm:-right-8 sm:bottom-10">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
              <CheckCircle2 size={23} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                Your Time, Your Choice
              </p>
              <p className="text-xs text-gray-500">
                Book your next appointment
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
