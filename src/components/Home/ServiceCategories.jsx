
"use client";

import Link from "next/link";
import {
  Scissors,
  Palette,
  Sparkles,
  Droplets,
  Brush,
  Hand,
  Flower2,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    name: "Haircut & Styling",
    slug: "haircut-styling",
    description: "Fresh cuts and beautiful hairstyles",
    icon: Scissors,
    color: "bg-rose-100 text-rose-600",
  },
  {
    name: "Hair Coloring",
    slug: "hair-coloring",
    description: "Give your hair a new look",
    icon: Palette,
    color: "bg-purple-100 text-purple-600",
  },
  {
    name: "Hair Treatment",
    slug: "hair-treatment",
    description: "Healthy and nourished hair",
    icon: Sparkles,
    color: "bg-amber-100 text-amber-600",
  },
  {
    name: "Facial & Skincare",
    slug: "facial-skincare",
    description: "Refresh and glow naturally",
    icon: Droplets,
    color: "bg-sky-100 text-sky-600",
  },
  {
    name: "Makeup",
    slug: "makeup",
    description: "Look beautiful for every occasion",
    icon: Brush,
    color: "bg-pink-100 text-pink-600",
  },
  {
    name: "Manicure & Pedicure",
    slug: "manicure-pedicure",
    description: "Give your hands and feet care",
    icon: Hand,
    color: "bg-orange-100 text-orange-600",
  },
  {
    name: "Spa & Massage",
    slug: "spa-massage",
    description: "Relax, refresh and feel better",
    icon: Flower2,
    color: "bg-emerald-100 text-emerald-600",
  },
];

const ServiceCategories = () => {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Section Heading */}
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
            Explore Categories
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Find Your Perfect{" "}
            <span className="text-rose-600">Salon Service</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            Discover professional beauty and wellness services.
            Choose a category and find the perfect treatment for you.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.slug}
                href={`/services?category=${encodeURIComponent(category.name)}`}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-100/50"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${category.color}`}
                  >
                    <Icon size={26} strokeWidth={1.8} />
                  </div>

                  <ArrowUpRight
                    size={21}
                    className="text-gray-300 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-rose-500"
                  />
                </div>

                <h3 className="mt-6 text-lg font-bold text-gray-900 transition-colors group-hover:text-rose-600">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {category.description}
                </p>

                <div className="mt-5 text-sm font-semibold text-rose-600">
                  Explore Services
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
