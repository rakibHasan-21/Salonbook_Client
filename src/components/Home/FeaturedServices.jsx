"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Search,
  Sparkles,
  Tag,
} from "lucide-react";
import { getServicesFeatured } from "@/lib/action_api/services";
import { LoadingMessage } from "@/components/shared/LoadingState";
import { toast } from "react-toastify";

const FeaturedServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    const loadServices = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getServicesFeatured({
          search: debouncedSearch,
          sort,
        });

        if (!Array.isArray(data)) {
          throw new Error("Invalid services response from server");
        }

        if (cancelled) return;

        setServices(
          data.filter((service) => service.status === "active").slice(0, 6)
        );
      } catch (error) {
        if (cancelled) return;

        console.error(error);
        const message =
          error.message || "Unable to load salon services. Please try again.";
        setError(message);
        toast.error(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadServices();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, sort]);

  if (loading) {
    return (
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <LoadingMessage
            title="Loading featured services"
            description="Finding our most popular salon treatments..."
            className="mb-8 justify-center rounded-2xl border border-rose-100 bg-white px-5 py-4 shadow-sm"
          />

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-[390px] animate-pulse rounded-2xl bg-rose-50"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-6 py-20 text-center">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  if (services.length === 0 && !debouncedSearch) {
    return (
      <section className="px-6 py-20 text-center">
        <p className="text-gray-500">
          No active salon services available right now.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-[#fffaf9] px-6 py-20 lg:py-24">
      <div className="mx-auto max-w-5xl">

        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white px-4 py-2 text-sm font-semibold text-rose-500">
            <Sparkles size={16} />
            Our Premium Services
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Featured Salon{" "}
            <span className="text-rose-500">Services</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
            Discover our professional beauty treatments and give yourself
            the care and attention you deserve.
          </p>
        </div>

        {/* Search + price sorting */}
        <div className="mx-auto mb-10 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search featured services by name..."
              aria-label="Search featured services by name"
              className="h-12 w-full rounded-xl border border-rose-100 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort featured services by price"
            className="h-12 rounded-xl border border-rose-100 bg-white px-4 text-sm font-semibold text-gray-700 outline-none focus:border-rose-400 sm:min-w-52"
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-rose-200 bg-white px-6 py-14 text-center">
            <Search className="mx-auto text-rose-300" size={38} />
            <h3 className="mt-4 text-lg font-bold text-gray-900">
              No services found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try another service name or clear the search.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSort("default");
              }}
              className="mt-5 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
            >
              Clear search
            </button>
          </div>
        ) : (
          <>
            {/* Services Grid */}
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service._id}
              className="group overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-rose-100/60"
            >
              {/* Service Image */}
              <div className="relative h-56 overflow-hidden bg-rose-50">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.serviceName}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-rose-300">
                    <Sparkles size={45} />
                  </div>
                )}

                <div className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold text-rose-600 shadow-sm">
                  {service.category}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">

                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-rose-600">
                    {service.serviceName}
                  </h3>

                  <div className="shrink-0 text-right">
                    <p className="text-lg font-extrabold text-rose-600">
                      ${service.price}
                    </p>
                  </div>
                </div>

                {/* Duration */}
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={16} className="text-rose-400" />
                  <span>{service.duration} minutes</span>
                </div>

                {/* Description */}
                <p className="mt-4 min-h-[48px] text-sm leading-6 text-gray-500 line-clamp-2">
                  {service.description}
                </p>

                {/* View Details */}
                <div className="mt-6 border-t border-gray-100 pt-4">
                  <Link
                    href={`/services/${service._id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-rose-600"
                  >
                    View Details
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>

              </div>
            </div>
          ))}
            </div>
          </>
        )}

        {/* Explore All Services */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-7 py-3.5 text-sm font-bold text-rose-600 transition-all hover:border-rose-500 hover:bg-rose-500 hover:text-white"
          >
            Explore All Services
            <ArrowRight size={17} />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedServices;
