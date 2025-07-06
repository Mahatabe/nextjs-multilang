import sql from "mssql";

const config: sql.config = {
  user: "sa",
  password: "12345",
  server: "DESKTOP-T9QAGET\\SQLEXPRESS",
  database: "NextJsPrac",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export async function connectToDatabase() {
  try {
    if (!sql.pool || !sql.pool.connected) {
      await sql.connect(config);
    }

    return sql;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}
