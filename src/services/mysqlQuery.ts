import type { MysqlQueryInput, MysqlQueryOutput } from "../types/tool";

let mysql: any;
try {
  mysql = await import("mysql2/promise");
} catch {
  throw new Error("mysql2/promise paketi yüklü olmalı.");
}

export async function runMysqlQuery({
  sql,
  host,
  port,
  user,
  password,
  database,
}: MysqlQueryInput): Promise<MysqlQueryOutput> {
  const config = {
    host,
    port: port ?? 3306,
    user,
    password,
    database,
  };
  const connection = await mysql.createConnection(config);
  try {
    const [rows, fields] = await connection.execute(sql);
    if (fields && Array.isArray(fields)) {
      // SELECT veya tablo döndüren sorgular
      const columns = fields.map((f: any) => f.name);
      return {
        columns,
        rows: Array.isArray(rows)
          ? rows.map((row: any) => columns.map((col: string) => row[col]))
          : [],
      };
    } else {
      // INSERT, UPDATE, DELETE gibi sorgular
      return {
        columns: ["affectedRows"],
        rows: [[(rows as any).affectedRows ?? 0]],
      };
    }
  } finally {
    await connection.end();
  }
}
