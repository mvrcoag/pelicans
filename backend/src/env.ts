import "dotenv/config";

const env = {
  PORT: process.env.PORT || 3200,
  NODE_ENV: process.env.NODE_ENV || "development",
  UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY || "",
} as const;

const requiredEnvVars = ["UNSPLASH_ACCESS_KEY"] as const;

for (const varName of requiredEnvVars) {
  if (!env[varName]) {
    throw new Error(`Environment variable ${varName} is required but not set.`);
  }
}

export default env;
