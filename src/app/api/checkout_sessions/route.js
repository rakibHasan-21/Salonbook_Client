import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { getAppointmentsCollection } from "@/lib/mongodb";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CURRENCY = (process.env.STRIPE_CURRENCY || "usd").toLowerCase();

const metadataValue = (value, fallback = "") =>
  String(value ?? fallback).slice(0, 500);

const getOrigin = (request) => {
  const origin = request.headers.get("origin");

  if (origin && /^https?:\/\//.test(origin)) {
    return origin.replace(/\/$/, "");
  }

  return new URL(request.url).origin;
};

export async function POST(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be signed in to pay for an appointment." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const appointmentId =
      typeof body?.appointmentId === "string" ? body.appointmentId.trim() : "";

    if (!ObjectId.isValid(appointmentId)) {
      return NextResponse.json(
        { error: "Invalid appointment ID." },
        { status: 400 }
      );
    }

    const appointmentsCollection = await getAppointmentsCollection();

    const appointment = await appointmentsCollection.findOne({
      _id: new ObjectId(appointmentId),
      customerEmail: session.user.email,
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found." },
        { status: 404 }
      );
    }

    if (appointment.status !== "Confirmed") {
      return NextResponse.json(
        { error: "Only confirmed appointments can be paid." },
        { status: 400 }
      );
    }

    if (appointment.paymentStatus === "Paid") {
      return NextResponse.json(
        { error: "This appointment has already been paid." },
        { status: 400 }
      );
    }

    const amount = Number(appointment.price);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "This appointment does not have a valid price." },
        { status: 400 }
      );
    }

    const unitAmount = Math.round(amount * 100);

    if (unitAmount < 50) {
      return NextResponse.json(
        { error: "The appointment price is below the Stripe minimum." },
        { status: 400 }
      );
    }

    const origin = getOrigin(request);
    const serviceName = appointment.serviceName || "Salon appointment";
    const description = [
      appointment.category,
      appointment.appointmentDate,
      appointment.appointmentTime,
    ]
      .filter(Boolean)
      .join(" • ");

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email,
      client_reference_id: appointmentId,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: CURRENCY,
            unit_amount: unitAmount,
            product_data: {
              name: serviceName,
              ...(description ? { description } : {}),
            },
          },
        },
      ],
      metadata: {
        appointmentId,
        customerEmail: metadataValue(session.user.email),
        customerName: metadataValue(
          session.user.name || appointment.customerName
        ),
        serviceId: metadataValue(appointment.serviceId),
        serviceName: metadataValue(serviceName),
        category: metadataValue(appointment.category),
        appointmentDate: metadataValue(appointment.appointmentDate),
        appointmentTime: metadataValue(appointment.appointmentTime),
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel?appointment_id=${encodeURIComponent(
        appointmentId
      )}`,
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout session error:", error);

    return NextResponse.json(
      { error: "Unable to start the payment. Please try again." },
      { status: 500 }
    );
  }
}
