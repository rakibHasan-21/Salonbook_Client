"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Sparkles,
  Tag,
} from "lucide-react";
import { getServicesFeatured } from "@/lib/action_api/services";

const FeaturedServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServicesFeatured();

        const activeServices = data
          .filter((service) => service.status === "active")
          .slice(0, 6);

        setServices(activeServices);
      } catch (error) {
        console.error(error);
        setError("Unable to load salon services. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  if (loading) {
    return (
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
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

  if (services.length === 0) {
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
