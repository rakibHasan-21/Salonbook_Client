import "server-only";

import { ObjectId } from "mongodb";

import {
  getAppointmentsCollection,
  getTransactionsCollection,
} from "@/lib/mongodb";

const getPaymentIntentId = (paymentIntent) => {
  if (!paymentIntent) return null;

  if (typeof paymentIntent === "string") return paymentIntent;

  return paymentIntent.id || null;
};

let transactionIndexPromise = null;

const ensureTransactionIndexes = async (collection) => {
  if (!transactionIndexPromise) {
    transactionIndexPromise = collection
      .createIndex({ stripeSessionId: 1 }, { unique: true, sparse: true })
      .catch((error) => {
        console.error(
          "Unable to create transactions stripeSessionId index:",
          error.message
        );
      });
  }

  await transactionIndexPromise;
};

/**
 * Persist a Stripe Checkout Session as a transaction and mark the related
 * appointment as paid. This function only runs for sessions that Stripe
 * reports as paid, and is safe to call more than once for the same session.
 */
export const finalizeCheckoutSession = async (session) => {
  if (!session || session.payment_status !== "paid") {
    return { recorded: false, reason: "Payment is not confirmed yet." };
  }

  const metadata = session.metadata || {};
  const appointmentId = metadata.appointmentId || session.client_reference_id;

  if (!appointmentId || !ObjectId.isValid(appointmentId)) {
    throw new Error("Checkout session is missing a valid appointment ID.");
  }

  const now = new Date();
  const amount =
    typeof session.amount_total === "number" ? session.amount_total / 100 : null;

  const transaction = {
    appointmentId,
    customerName: metadata.customerName || session.customer_details?.name || "",
    customerEmail:
      metadata.customerEmail ||
      session.customer_details?.email ||
      session.customer_email ||
      "",
    serviceId: metadata.serviceId || "",
    serviceName: metadata.serviceName || "",
    category: metadata.category || "",
    appointmentDate: metadata.appointmentDate || "",
    appointmentTime: metadata.appointmentTime || "",
    paymentAmount: amount,
    currency: session.currency || "usd",
    paymentStatus: "Paid",
    stripeSessionId: session.id,
    stripePaymentIntentId: getPaymentIntentId(session.payment_intent),
    transactionDate: now,
    updatedAt: now,
  };

  const transactionsCollection = await getTransactionsCollection();

  await ensureTransactionIndexes(transactionsCollection);

  try {
    await transactionsCollection.updateOne(
      { stripeSessionId: session.id },
      {
        $set: transaction,
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );
  } catch (error) {
    // A concurrent webhook delivery may have inserted the same session.
    if (error?.code !== 11000) {
      throw error;
    }
  }

  const appointmentsCollection = await getAppointmentsCollection();

  const appointmentResult = await appointmentsCollection.updateOne(
    {
      _id: new ObjectId(appointmentId),
      paymentStatus: { $ne: "Paid" },
    },
    {
      $set: {
        paymentStatus: "Paid",
        paidAt: now,
        stripeSessionId: session.id,
        updatedAt: now,
      },
    }
  );

  return {
    recorded: true,
    appointmentUpdated: appointmentResult.modifiedCount > 0,
  };
};
