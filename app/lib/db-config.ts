const getEnvironmentConfig = () => {
  // Durante el build, pueden no estar todas las variables
  const vercelEnv = process.env.VERCEL_ENV || "development";
  const nodeEnv = process.env.NODE_ENV || "development";

  // Para build time, usar configuración básica
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return {
      environment: "build",
      authUrl: process.env.AUTH_URL || "https://localhost:3000",
      databaseUrl:
        process.env.DATABASE_URL ||
        "postgresql://build:build@localhost:5432/build",
      cloudinaryFolder: "build",
    };
  }

  // Configuraciones runtime
  if (vercelEnv === "production") {
    const authUrl = process.env.AUTH_URL;
    if (!authUrl) {
      throw new Error("AUTH_URL is required in production");
    }

    return {
      environment: "production",
      authUrl,
      databaseUrl: process.env.DATABASE_URL!,
      cloudinaryFolder: authUrl.includes("staging") ? "staging" : "production",
    };
  }

  return {
    environment: "development",
    authUrl: process.env.AUTH_URL || "http://localhost:3000",
    databaseUrl: process.env.DATABASE_URL || "postgresql://localhost:5432/dev",
    cloudinaryFolder: "development",
  };
};

export const config = getEnvironmentConfig();
