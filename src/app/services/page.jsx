
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getServices } from "@/lib/action_api/services";
import {
  Search,
  Clock,
  ArrowUpRight,
  Scissors,
} from "lucide-react";
import { toast } from "react-toastify";
import { LoadingMessage } from "@/components/shared/LoadingState";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [reloadKey, setReloadKey] = useState(0);

  // Debounce the search box so we do not hit the API on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        // The backend filters by service name and sorts by price, so the
        // query stays small even when the catalogue grows. Category stays a
        // client-side filter so the category list never collapses.
        const data = await getServices({
          search: debouncedSearch,
          sort,
        });

        if (!Array.isArray(data)) {
          throw new Error("Invalid services response from server");
        }

        if (cancelled) return;

        setServices(data.filter((service) => service.status === "active"));
      } catch (err) {
        if (cancelled) return;

        console.error("Services fetch error:", err);
        const message = err.message || "Unable to load services. Please try again.";
        setError(message);
        toast.error(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchServices();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, sort, reloadKey]);

  // Get unique categories
  const categories = [
    "all",
    ...new Set(services.map((service) => service.category).filter(Boolean)),
  ];

  // Search, category filter and sorting
  const filteredServices = useMemo(() => {
    let result = [...services];

    if (search.trim()) {
      result = result.filter((service) =>
        service.serviceName
          ?.toLowerCase()
          .includes(search.trim().toLowerCase())
      );
    }

    if (category !== "all") {
      result = result.filter(
        (service) => service.category === category
      );
    }

    if (sort === "low-to-high") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "high-to-low") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [services, search, category, sort]);

  return (
    <main className="min-h-screen bg-[#fffafa]">
      {/* Header */}
      <section className="border-b border-rose-100 bg-gradient-to-br from-rose-50 via-white to-pink-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex rounded-full bg-rose-100 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-rose-600">
            Our Services
          </span>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Discover Your Perfect{" "}
            <span className="text-rose-600">Beauty Service</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            Explore our professional salon services and find the perfect
            treatment to make you look and feel your best.
          </p>
        </div>
      </section>

      {/* Services */}
      <section
        className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8"
        aria-busy={loading}
      >
        {/* Search and Filters */}
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Explore All Services
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {loading
                ? "Loading services..."
                : `${filteredServices.length} services available`}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100 sm:w-64"
              />
            </div>

            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none focus:border-rose-400 sm:min-w-48"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "all" ? "All Categories" : item}
                </option>
              ))}
            </select>

            {/* Price Sorting */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none focus:border-rose-400 sm:min-w-48"
            >
              <option value="default">Default Sorting</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div>
            <LoadingMessage
              title="Loading services"
              description="Fetching the latest salon services for you..."
              className="mb-6 rounded-2xl border border-rose-100 bg-white px-5 py-4 shadow-sm"
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
                >
                  <div className="h-56 animate-pulse bg-gray-200" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
            <p className="font-medium text-red-600">{error}</p>
            <button
              onClick={() => setReloadKey((key) => key + 1)}
              className="mt-4 rounded-lg bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredServices.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
            <Scissors className="mx-auto text-rose-400" size={40} />
            <h3 className="mt-4 text-xl font-bold text-gray-900">
              No Services Found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try another search or category.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("all");
                setSort("default");
              }}
              className="mt-5 text-sm font-semibold text-rose-600 hover:text-rose-700"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Service Cards */}
        {!loading && !error && filteredServices.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <article
                key={service._id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-100/60"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-rose-50">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.serviceName}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Scissors size={48} className="text-rose-300" />
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-rose-600 shadow-sm">
                    {service.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-rose-600">
                    {service.serviceName}
                  </h3>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">
                    {service.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-xs text-gray-400">Starting from</p>
                      <p className="mt-1 text-xl font-bold text-rose-600">
                        ${service.price}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Clock size={16} />
                      {service.duration} min
                    </div>
                  </div>

                  <Link
                    href={`/services/${service._id}`}
                    className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-900 text-sm font-semibold text-white transition hover:bg-rose-600"
                  >
                    View Details
                    <ArrowUpRight size={17} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Services;
