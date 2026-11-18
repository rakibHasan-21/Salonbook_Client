
import React from "react";
import Link from "next/link";
import { getServiceById } from "@/lib/action_api/services";
import { Clock, ArrowLeft, Scissors } from "lucide-react";

const ServiceDetails = async ({ params }) => {
  const { id } = await params;

  let service;

  try {
    service = await getServiceById(id);
  } catch (error) {
     console.error("SERVICE DETAILS ERROR:", error);
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <Scissors className="mx-auto text-rose-500" size={48} />

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Service Not Found
          </h1>

          <p className="mt-2 text-gray-500">
            The service you are looking for does not exist.
          </p>

          <Link
            href="/services"
            className="mt-6 inline-flex rounded-xl bg-rose-600 px-6 py-3 text-white hover:bg-rose-700"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Services
          </Link>
        </div>
      </main>
    );
  }

  const isActive = service.status === "active";

  return (
    <main className="min-h-screen bg-[#fffafa] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        <Link
          href="/services"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-rose-600"
        >
          <ArrowLeft size={18} />
          Back to Services
        </Link>

        <div className="grid gap-10 overflow-hidden rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:grid-cols-2 md:p-8">

          {/* Service Image */}
          <div className="overflow-hidden rounded-2xl bg-rose-50">
            {service.image ? (
              <img
                src={service.image}
                alt={service.serviceName}
                className="h-full min-h-72 w-full object-cover"
              />
            ) : (
              <div className="flex min-h-72 items-center justify-center">
                <Scissors size={60} className="text-rose-300" />
              </div>
            )}
          </div>

          {/* Service Information */}
          <div className="flex flex-col justify-center py-3">

            <span className="w-fit rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600">
              {service.category}
            </span>

            <h1 className="mt-5 text-3xl font-bold text-gray-900 sm:text-4xl">
              {service.serviceName}
            </h1>

            <p className="mt-5 leading-8 text-gray-500">
              {service.description}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">

              <div className="rounded-xl bg-rose-50 p-4">
                <p className="text-sm text-gray-500">Service Price</p>
                <p className="mt-2 text-2xl font-bold text-rose-600">
                  ${service.price}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Duration</p>
                <p className="mt-2 flex items-center gap-2 text-xl font-bold text-gray-900">
                  <Clock size={19} />
                  {service.duration} min
                </p>
              </div>

            </div>

            {isActive ? (
              <Link
                href={`/services/${id}#booking`}
                className="mt-8 flex h-12 items-center justify-center rounded-xl bg-rose-600 font-semibold text-white transition hover:bg-rose-700"
              >
                Book Appointment
              </Link>
            ) : (
              <button
                disabled
                className="mt-8 h-12 cursor-not-allowed rounded-xl bg-gray-200 font-semibold text-gray-500"
              >
                Service Currently Unavailable
              </button>
            )}

          </div>
        </div>
      </div>
    </main>
  );
};

export default ServiceDetails;
