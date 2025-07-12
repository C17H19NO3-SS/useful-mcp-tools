export function getGoogleApiKey(): string {
  return process.env.GOOGLE_API_KEY || "YOUR_API_KEY";
}

export function getGoogleCx(): string {
  return process.env.GOOGLE_CX || "YOUR_CX";
}

export function getMysqlConfig() {
  return {
    host: process.env.MYSQL_HOST || "localhost",
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "test",
  };
}

export function getGeminiApiKey(): string {
  return (
    process.env.GEMINI_API_KEY || "AIzaSyBGgvJJDklDA23sxg6H2kQD1hc6rByHShE"
  );
}
