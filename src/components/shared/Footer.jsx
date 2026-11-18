import Link from "next/link";
import {
  Scissors,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-rose-100 bg-[#fffaf9]">
      {/* Main Footer */}
      <div className="mx-auto max-w-5xl px-6 pb-12 pt-16 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Description */}
          <div>
            <Link href="/" className="mb-5 inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <Scissors size={23} />
              </div>

              <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                Salon<span className="text-rose-500">Book</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-gray-500">
              Your beauty, your schedule. Discover trusted salon services and
              book your favorite beauty treatments with ease.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-100 bg-white text-gray-600 transition-all duration-300 hover:border-rose-500 hover:bg-rose-500 hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.5 1.6-1.5h1.7V3.1c-.3 0-1.4-.1-2.6-.1-2.6 0-4.3 1.6-4.3 4.4v2.2H7v3.2h2.9V21h3.6Z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-100 bg-white text-gray-600 transition-all duration-300 hover:border-rose-500 hover:bg-rose-500 hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>

              {/* X */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-100 bg-white text-gray-600 transition-all duration-300 hover:border-rose-500 hover:bg-rose-500 hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.6 22H2.4l7.3-8.4L1.8 2h6.5l4.5 6.8L18.9 2Zm-1.1 18h1.7L7.2 3.9H5.4L17.8 20Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-base font-bold text-gray-900">
              Quick Links
            </h3>

            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-500 transition hover:text-rose-600"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/services"
                  className="text-sm text-gray-500 transition hover:text-rose-600"
                >
                  Browse Services
                </Link>
              </li>

              <li>
                <Link
                  href="/sign-in"
                  className="text-sm text-gray-500 transition hover:text-rose-600"
                >
                  Sign In
                </Link>
              </li>

              <li>
                <Link
                  href="/sign-up"
                  className="text-sm text-gray-500 transition hover:text-rose-600"
                >
                  Create Account
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-500 transition hover:text-rose-600"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="mb-6 text-base font-bold text-gray-900">
              Contact Us
            </h3>

            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                  <MapPin size={17} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400">
                    Our Address
                  </p>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Your Salon Address, Dhaka, Bangladesh
                  </p>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                  <Phone size={17} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400">
                    Phone Number
                  </p>
                  <a
                    href="tel:+8801000000000"
                    className="mt-1 block text-sm text-gray-600 transition hover:text-rose-600"
                  >
                    +880 1XXXXXXXXX
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                  <Mail size={17} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400">
                    Email Address
                  </p>
                  <a
                    href="mailto:hello@salonbook.com"
                    className="mt-1 block break-all text-sm text-gray-600 transition hover:text-rose-600"
                  >
                    hello@salonbook.com
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="mb-6 text-base font-bold text-gray-900">
              Opening Hours
            </h3>

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                <Clock size={17} />
              </div>

              <p className="text-sm font-medium text-gray-600">
                Visit Us Anytime
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Saturday - Thursday</span>
                <span className="font-semibold text-gray-700">
                  10 AM - 9 PM
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Friday</span>
                <span className="font-semibold text-rose-500">Closed</span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-rose-100 bg-white p-4">
              <p className="text-sm font-semibold text-gray-800">
                Ready for a fresh look?
              </p>

              <Link
                href="/services"
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-rose-600 transition hover:gap-3"
              >
                Book an Appointment
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-rose-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-center sm:flex-row sm:text-left lg:px-8">
          <p className="text-sm text-gray-500">
            © {currentYear}{" "}
            <span className="font-bold text-rose-500">SalonBook</span>. All
            rights reserved.
          </p>

          <div className="flex items-center gap-5 text-xs text-gray-400">
            <Link
              href="/privacy-policy"
              className="transition hover:text-rose-500"
            >
              Privacy Policy
            </Link>

            <Link href="/terms" className="transition hover:text-rose-500">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
