export const env = {
  API_URL: import.meta.env.VITE_API_URL,
} as {
  API_URL: string;
};

const requiredEnvVars = ["VITE_API_URL"] as const;

requiredEnvVars.forEach((varName) => {
  if (!import.meta.env[varName]) {
    throw new Error(
      `Environment variable ${varName} is required but not defined.`,
    );
  }
});
