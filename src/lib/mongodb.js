import "server-only";

import { MongoClient } from "mongodb";

const MONGODB_URL = process.env.MONGODB_URL;
const DB_NAME = "SalonBook";

// Reuse the connection across hot reloads and route invocations.
const globalForMongo = globalThis;

if (!globalForMongo.__salonbookMongo) {
  globalForMongo.__salonbookMongo = {
    client: null,
    promise: null,
  };
}

const cached = globalForMongo.__salonbookMongo;

export const getDb = async () => {
  if (!MONGODB_URL) {
    throw new Error("MONGODB_URL is not configured.");
  }

  if (!cached.promise) {
    const client = new MongoClient(MONGODB_URL);

    cached.promise = client
      .connect()
      .then(() => client)
      .catch((error) => {
        cached.promise = null;
        cached.client = null;
        throw error;
      });
  }

  cached.client = await cached.promise;

  return cached.client.db(DB_NAME);
};

export const getAppointmentsCollection = async () => {
  const db = await getDb();
  return db.collection("appointments");
};

export const getTransactionsCollection = async () => {
  const db = await getDb();
  return db.collection("transactions");
};
