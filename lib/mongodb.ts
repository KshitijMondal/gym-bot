import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in environment variables.");
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: MongooseCache | undefined;
}

const globalCache = globalThis.__mongooseCache ?? {
  conn: null,
  promise: null,
};

globalThis.__mongooseCache = globalCache;

export default async function dbConnect(): Promise<typeof mongoose> {
  if (globalCache.conn) return globalCache.conn;

  if (!globalCache.promise) {
    mongoose.set("strictQuery", true);

    globalCache.promise = mongoose
      .connect(MONGODB_URI as string, {
        bufferCommands: false,
      })
      .then((m) => m);
  }

  try {
    globalCache.conn = await globalCache.promise;
  } catch (err) {
    globalCache.promise = null;
    throw err;
  }

  return globalCache.conn;
}
