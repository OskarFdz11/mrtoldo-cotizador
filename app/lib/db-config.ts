const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV;
  const vercelEnv = process.env.VERCEL_ENV;

  // Determinar el entorno actual
  if (vercelEnv === "production") {
    return {
      environment: "production",
      databaseUrl: process.env.DATABASE_URL,
      authUrl: process.env.AUTH_URL!,
      cloudinaryFolder: "production",
    };
  }

  if (vercelEnv === "preview") {
    return {
      environment: "staging",
      databaseUrl: process.env.DATABASE_URL_STAGING!,
      authUrl: process.env.AUTH_URL_STAGING!,
      cloudinaryFolder: "staging",
    };
  }

  // Development (local)
  return {
    environment: "development",
    databaseUrl: process.env.DATABASE_URL_STAGING!,
    authUrl: "http://localhost:3000",
    cloudinaryFolder: "development",
  };
};

export const config = getEnvironmentConfig();
