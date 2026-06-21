const fallbackDatabaseUrl = "postgresql://postgres:postgres@127.0.0.1:5432/booking";

export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? fallbackDatabaseUrl,
  BETTER_AUTH_SECRET:
    process.env.BETTER_AUTH_SECRET ??
    "replace-this-with-a-long-random-secret-in-production",
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  GOOGLE_CLIENT_ID:
    process.env.GOOGLE_CLIENT_ID ?? "replace-this-with-your-google-client-id",
  GOOGLE_CLIENT_SECRET:
    process.env.GOOGLE_CLIENT_SECRET ??
    "replace-this-with-your-google-client-secret",
};
