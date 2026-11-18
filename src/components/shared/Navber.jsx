
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Scissors,
  X,
  ArrowUpRight,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Services", href: "/services" },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Better Auth session
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const isLoggedIn = !!user;

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Logout
  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed.");
        return;
      }

      toast.success("Logged out successfully!");

      setProfileOpen(false);
      setMenuOpen(false);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong during logout.");
    } finally {
      setLoggingOut(false);
    }
  };

  const userName = user?.name || "User";
  const userRole = user?.role || "customer";
  const userImage = user?.image;

  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl">
      <nav className="mx-auto flex h-[76px] max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-pink-50 text-rose-600 transition duration-300 group-hover:rotate-[-8deg]">
            <Scissors size={22} strokeWidth={1.8} />
          </div>

          <div>
            <h1 className="text-[21px] font-extrabold tracking-tight text-gray-900">
              Salon<span className="text-rose-500">Book</span>
            </h1>
            <p className="text-[9px] font-semibold tracking-[2.5px] text-gray-400">
              BEAUTY & CARE
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`group relative py-2 text-[14px] font-semibold transition-all duration-300 ${
                isActive(link.href)
                  ? "text-rose-500"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {link.name}

              <span
                className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-rose-400 transition-all duration-300 ${
                  isActive(link.href)
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-gray-100" />
          ) : !isLoggedIn ? (
            <>
              <Link
                href="/sign-in"
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-gray-600 transition-all duration-300 hover:bg-rose-50 hover:text-rose-600"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="group flex items-center gap-2 rounded-full border border-rose-200/80 bg-gradient-to-r from-rose-50 to-pink-50 px-5 py-2.5 text-sm font-bold text-rose-600 shadow-sm transition-all duration-300 hover:border-rose-300 hover:shadow-[0_5px_20px_rgba(244,63,94,0.12)]"
              >
                Get Started
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </>
          ) : (
            <>
              {/* Dashboard */}
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  isActive("/dashboard")
                    ? "bg-rose-50 text-rose-600"
                    : "text-gray-600 hover:bg-rose-50 hover:text-rose-600"
                }`}
              >
                <LayoutDashboard size={17} />
                Dashboard
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1.5 pl-1.5 pr-3 transition hover:border-rose-200 hover:bg-rose-50"
                  aria-expanded={profileOpen}
                >
                  {userImage ? (
                    <img
                      src={userImage}
                      alt={userName}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 font-bold text-rose-600">
                      {userInitial}
                    </div>
                  )}

                  <span className="max-w-28 truncate text-sm font-semibold text-gray-700">
                    {userName}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                    <div className="border-b border-gray-100 px-3 py-3">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {userName}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                      <span className="mt-2 inline-block rounded-full bg-rose-50 px-3 py-1 text-[10px] font-bold capitalize text-rose-600">
                        {userRole}
                      </span>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <LayoutDashboard size={17} />
                      Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <LogOut size={17} />
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200/80 bg-white/70 text-gray-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`grid transition-all duration-300 ease-in-out md:hidden ${
          menuOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-gray-100/80 bg-white/95 px-5 py-5 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl flex-col gap-2">

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    isActive(link.href)
                      ? "bg-rose-50 text-rose-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-rose-600"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="mt-3 flex flex-col gap-3 border-t border-gray-100 pt-4">
                {isPending ? (
                  <div className="h-10 animate-pulse rounded-xl bg-gray-100" />
                ) : !isLoggedIn ? (
                  <>
                    <Link
                      href="/sign-in"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-full border border-gray-200 bg-white px-5 py-3 text-center text-sm font-semibold text-gray-700 transition hover:border-rose-200 hover:text-rose-600"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/sign-up"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-full bg-rose-50 px-5 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-100"
                    >
                      Get Started
                      <ArrowUpRight size={16} />
                    </Link>
                  </>
                ) : (
                  <>
                    {/* Mobile User Info */}
                    <div className="flex items-center gap-3 rounded-xl bg-rose-50 p-3">
                      {userImage ? (
                        <img
                          src={userImage}
                          alt={userName}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white font-bold text-rose-600">
                          {userInitial}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-900">
                          {userName}
                        </p>
                        <p className="text-xs capitalize text-rose-600">
                          {userRole}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <LogOut size={18} />
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
